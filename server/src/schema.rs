pub mod product;

use juniper::{graphql_object, EmptySubscription};
use sqlx::{Pool, Postgres};

use self::product::{ProductMutation, ProductQuery};

/// The GraphQL context.
pub struct Context {
    pub pool: Pool<Postgres>,
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
}

/// The GraphQL mutation object.
pub struct Mutation;

#[graphql_object(context = Context)]
impl Mutation {
    fn product() -> ProductMutation {
        ProductMutation
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;
