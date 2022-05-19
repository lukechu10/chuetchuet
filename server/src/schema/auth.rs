use argon2::Config;
use base64::STANDARD_NO_PAD;
use chrono::{DateTime, Utc};
use jsonwebtoken::{EncodingKey, Header};
use juniper::{graphql_object, FieldResult, GraphQLObject};
use once_cell::sync::Lazy;
use rand::RngCore;
use regex::Regex;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::Context;

#[derive(GraphQLObject)]
pub struct UserResult {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
}

#[derive(GraphQLObject)]
pub struct SignupResult {
    pub id: Uuid,
}

#[derive(GraphQLObject)]
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

pub struct AuthQuery;

#[graphql_object]
impl AuthQuery {
    fn test() -> &'static str {
        "test"
    }
}

pub struct AuthMutation;

#[graphql_object]
impl AuthMutation {
    async fn login(context: &Context, email: String, password: String) -> FieldResult<AuthPayload> {
        // Fetch user password hash from database.
        let row = sqlx::query!(
            "SELECT id, email, password_hash FROM users WHERE email = $1",
            email
        )
        .fetch_optional(&context.pool)
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
        context: &Context,
        name: String,
        email: String,
        password: String,
    ) -> FieldResult<SignupResult> {
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
        if password.chars().count() <= 5 {
            Err("password must have at least 5 characters")?;
        }
        // TODO: add other validations.
        // Check that an account with email has not already been created.
        if sqlx::query!("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email)
            .fetch_one(&context.pool)
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
        .fetch_one(&context.pool)
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
