pub mod auth;
pub mod product;

use async_graphql::Object;

use self::auth::{AuthMutation, AuthQuery};
use self::product::{ProductMutation, ProductQuery};

/// The GraphQL query object.
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn api_version(&self) -> &'static str {
        "0.1.0"
    }

    async fn product(&self) -> ProductQuery {
        ProductQuery
    }

    async fn auth(&self) -> AuthQuery {
        AuthQuery
    }
}

/// The GraphQL mutation object.
pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn product(&self) -> ProductMutation {
        ProductMutation
    }

    async fn auth(&self) -> AuthMutation {
        AuthMutation
    }
}
