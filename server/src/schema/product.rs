use juniper::{graphql_object, FieldResult, GraphQLInputObject, GraphQLObject};

use super::Context;

pub struct ProductQuery;

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

#[graphql_object(context = Context)]
impl ProductQuery {
    /// Returns a single product with the specified id.
    async fn get_product(context: &Context, id: i32) -> FieldResult<Product> {
        let product = sqlx::query!("SELECT id, name FROM products WHERE id = $1", id)
            .fetch_one(&context.pool)
            .await?;
        Ok(Product {
            id: product.id,
            name: product.name,
        })
    }

    /// Returns all the products.
    async fn get_products(context: &Context) -> FieldResult<Vec<Product>> {
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

pub struct ProductMutation;

#[graphql_object(context = Context)]
impl ProductMutation {
    async fn create_product(context: &Context, name: String) -> FieldResult<Product> {
        let row = sqlx::query!("INSERT INTO products (name) VALUES ($1) RETURNING id", name)
            .fetch_one(&context.pool)
            .await?;

        Ok(Product { id: row.id, name })
    }
}
