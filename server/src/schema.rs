use juniper::{graphql_object, EmptySubscription, FieldResult, GraphQLObject};

/// A product.
#[derive(GraphQLObject)]
pub struct Product {
    pub id: String,
    pub name: String,
}

pub struct Context {}
impl juniper::Context for Context {}

pub struct Query;

#[graphql_object(context = Context)]
impl Query {
    fn api_version() -> &'static str {
        "0.1.0"
    }

    fn product(context: &Context, id: String) -> FieldResult<Product> {
        Ok(Product {
            id: "test id".to_string(),
            name: "A product".to_string(),
        })
    }
}

pub struct Mutation;
#[graphql_object(context = Context)]
impl Mutation {
    fn create_product() -> FieldResult<Product> {
        todo!();
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;
