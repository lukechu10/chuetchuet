use argon2::Config;
use chrono::{DateTime, Utc};
use juniper::{graphql_object, FieldResult, GraphQLInputObject, GraphQLObject};
use uuid::Uuid;

use super::Context;

#[derive(GraphQLObject)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

pub struct AuthQuery;

#[graphql_object]
impl AuthQuery {
    fn get_user(id: Uuid) -> FieldResult<User> {
        todo!();
    }
}

pub struct AuthMutation;

#[graphql_object]
impl AuthMutation {
    fn login(email: String, _password: String) -> FieldResult<User> {
        Ok(User {
            id: Uuid::nil(),
            name: "Not me!".to_string(),
            email,
            password_hash: "not a hash".to_string(),
            created_at: Utc::now(),
        })
    }

    fn signup(name: String, email: String, password: String) -> FieldResult<User> {
        let password_hash = hash_password(&password);
        todo!();
    }
}

fn hash_password(password: &str) -> String {
    // TODO: do not store the salt here.
    static SALT: &[u8] = b"random salt";
    let config = Config::default();
    argon2::hash_encoded(password.as_bytes(), SALT, &config).expect("could not hash password")
}
