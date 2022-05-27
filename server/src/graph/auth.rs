use argon2::Config;
use async_graphql::{Context, Object, Result, SimpleObject};
use base64::STANDARD_NO_PAD;
use chrono::{DateTime, Utc};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation};
use once_cell::sync::Lazy;
use rand::RngCore;
use regex::Regex;
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

/// Extract the JWT from the `Authorization` header, if it exists.
pub struct AuthInfo {
    pub token: Option<String>,
    pub claims: Option<Claims>,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthInfo {
    type Error = anyhow::Error;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.headers().get_one("Authorization") {
            None => Outcome::Success(AuthInfo {
                token: None,
                claims: None,
            }),
            Some(val) => {
                if let Some(token) = val.strip_prefix("Bearer ").map(String::from) {
                    let secret = dotenv::var("JWT_SECRET").expect("could not read JWT_SECRET");
                    if let Ok(data) = jsonwebtoken::decode(
                        &token,
                        &DecodingKey::from_secret(secret.as_bytes()),
                        &Validation::new(Algorithm::HS256),
                    ) {
                        Outcome::Success(AuthInfo {
                            token: Some(token),
                            claims: Some(data.claims),
                        })
                    } else {
                        Outcome::Success(AuthInfo {
                            token: None,
                            claims: None,
                        })
                    }
                } else {
                    Outcome::Success(AuthInfo {
                        token: None,
                        claims: None,
                    })
                }
            }
        }
    }
}

#[derive(SimpleObject)]
pub struct UserResult {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
}

#[derive(SimpleObject)]
pub struct SignupResult {
    pub id: Uuid,
}

#[derive(SimpleObject)]
pub struct AuthPayload {
    pub id: Uuid,
    pub email: String,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub id: Uuid,
    pub email: String,
    /// Issued at (seconds since UNIX epoch).
    pub iat: i64,
    /// Expiration time (seconds since UNIX epoch).
    pub exp: i64,
}

/// Returns a tuple of type `(i64, i64)` representing the `iat` and `exp` fields for the JWT claims respectively.
fn get_iat_exp() -> (i64, i64) {
    const EXP_DURATION_SECS: i64 = 60 * 60; // 1 hour
    let now = Utc::now().timestamp();
    (now, now + EXP_DURATION_SECS)
}

fn create_auth_payload(id: Uuid, email: String) -> AuthPayload {
    let (iat, exp) = get_iat_exp();
    let claims = Claims {
        id,
        email: email.clone(),
        iat,
        exp,
    };
    let secret = dotenv::var("JWT_SECRET").expect("could not read JWT_SECRET");
    let token = jsonwebtoken::encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .expect("could not encode JWT token");
    AuthPayload { id, email, token }
}

#[derive(Default)]
pub struct AuthQuery;

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    async fn id(&self, context: &Context<'_>) -> Result<Uuid> {
        let claims = context
            .data::<AuthInfo>()
            .unwrap()
            .claims
            .as_ref()
            .ok_or("access denied")?;
        Ok(claims.id)
    }
}

#[derive(Default)]
pub struct AuthMutation;

#[Object]
impl AuthMutation {
    async fn login(
        &self,
        context: &Context<'_>,
        email: String,
        password: String,
    ) -> Result<AuthPayload> {
        // Fetch user password hash from database.
        let row = sqlx::query!(
            "SELECT id, email, password_hash FROM users WHERE email = $1",
            email
        )
        .fetch_optional(context.data::<PgPool>().unwrap())
        .await?;
        let row = match row {
            Some(row) => row,
            None => Err("invalid username or password")?,
        };
        // Try to verify password.
        let verified = argon2::verify_encoded(&row.password_hash, password.as_bytes())
            .expect("could not verify password");
        if !verified {
            Err("invalid username or password")?;
        }

        // Authenticated. Return auth payload.
        Ok(create_auth_payload(row.id, email))
    }

    async fn signup(
        &self,
        context: &Context<'_>,
        name: String,
        email: String,
        password: String,
    ) -> Result<SignupResult> {
        static EMAIL_REGEX: Lazy<Regex> = Lazy::new(|| {
            Regex::new(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
                .unwrap()
        });
        // Validate email field.
        if !EMAIL_REGEX.is_match(&email) {
            Err("email is malformed")?;
        }
        // Valid password.
        // Password must be at least 5 characters long.
        if password.chars().count() < 5 {
            Err("password must have at least 5 characters")?;
        }
        // TODO: add other validations.
        // Check that an account with email has not already been created.
        if sqlx::query!("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email)
            .fetch_one(context.data::<PgPool>().unwrap())
            .await?
            .exists
            == Some(true)
        {
            Err("email already in use")?;
        }
        // Get current time.
        let created_at = Utc::now().naive_utc().date();
        let password_hash = hash_password(&password);
        let id = Uuid::new_v4();

        // Create account and return new id.
        let row = sqlx::query!(
            "INSERT INTO users (id, name, email, password_hash, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id",
            id,
            name,
            email,
            password_hash,
            created_at,
        )
        .fetch_one(context.data::<PgPool>().unwrap())
        .await?;
        Ok(SignupResult { id: row.id })
    }
}

/// Generate a salt (in base64) from `len` number of random bytes.
fn gen_salt(len: usize) -> String {
    let mut bytes = vec![0u8; len];
    rand::thread_rng().fill_bytes(&mut bytes);
    base64::encode_config(bytes, STANDARD_NO_PAD)
}

fn hash_password(password: &str) -> String {
    const SALT_LEN: usize = 16;
    let config = Config::default();
    let salt = gen_salt(SALT_LEN);
    argon2::hash_encoded(password.as_bytes(), salt.as_bytes(), &config)
        .expect("could not hash password")
}
