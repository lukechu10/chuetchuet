pub mod auth;
pub mod product;

use juniper::{graphql_object, EmptySubscription};
use sqlx::{Pool, Postgres};

use crate::AuthInfo;

use self::auth::{AuthMutation, AuthQuery};
use self::product::{ProductMutation, ProductQuery};

/// The GraphQL context.
pub struct Context {
    pub pool: Pool<Postgres>,
    pub auth: AuthInfo,
}
impl juniper::Context for Context {}

/// The GraphQL query object.
pub struct Query;

#[graphql_object(context = Context)]
impl Query {
    fn api_version() -> &'static str {
        "0.1.0"
    }

    fn product() -> ProductQuery {
        ProductQuery
    }

    fn auth() -> AuthQuery {
        AuthQuery
    }
}

/// The GraphQL mutation object.
pub struct Mutation;

#[graphql_object(context = Context)]
impl Mutation {
    fn product() -> ProductMutation {
        ProductMutation
    }

    fn auth() -> AuthMutation {
        AuthMutation
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;
