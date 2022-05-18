use juniper::{graphql_object, EmptySubscription, FieldResult, GraphQLInputObject, GraphQLObject};
use sqlx::{Pool, Postgres};

/// A product.
#[derive(GraphQLObject)]
pub struct Product {
    pub id: i32,
    pub name: String,
}

#[derive(GraphQLInputObject)]
pub struct NewProduct {
    pub name: String,
}

pub struct Context {
    pub pool: Pool<Postgres>,
}
impl juniper::Context for Context {}

pub struct Query;

#[graphql_object(context = Context)]
impl Query {
    fn api_version() -> &'static str {
        "0.1.0"
    }

    async fn product(context: &Context, id: i32) -> FieldResult<Product> {
        let product = sqlx::query!("SELECT id, name FROM products WHERE id = $1", id)
            .fetch_one(&context.pool)
            .await?;
        Ok(Product {
            id: product.id,
            name: product.name,
        })
    }

    async fn products(context: &Context) -> FieldResult<Vec<Product>> {
        let products = sqlx::query!("SELECT id, name FROM products")
            .fetch_all(&context.pool)
            .await?
            .into_iter()
            .map(|row| Product {
                id: row.id,
                name: row.name,
            })
            .collect();
        Ok(products)
    }
}

pub struct Mutation;
#[graphql_object(context = Context)]
impl Mutation {
    async fn create_product(context: &Context, name: String) -> FieldResult<Product> {
        let row = sqlx::query!("INSERT INTO products (name) VALUES ($1) RETURNING id", name)
            .fetch_one(&context.pool)
            .await?;

        Ok(Product { id: row.id, name })
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;
