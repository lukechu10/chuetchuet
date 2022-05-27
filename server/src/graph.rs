pub mod auth;
pub mod product;

use async_graphql::{MergedObject, Object};

use self::auth::{AuthMutation, UserQuery};
use self::product::{ProductMutation, ProductQuery};

/// The root GraphQL query object.
#[derive(Default, MergedObject)]
pub struct QueryRoot(ApiVersionQuery, ProductQuery, UserQuery);

#[derive(Default)]
pub struct ApiVersionQuery;

#[Object]
impl ApiVersionQuery {
    /// The current version of the API.
    async fn api_version(&self) -> &'static str {
        "0.1.0"
    }
}

/// The GraphQL mutation object.
#[derive(Default, MergedObject)]
pub struct MutationRoot(ProductMutation, AuthMutation);
