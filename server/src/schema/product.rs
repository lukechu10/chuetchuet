use async_graphql::{Context, InputObject, Object, Result, SimpleObject};
use sqlx::PgPool;

pub struct ProductQuery;

/// A product.
#[derive(SimpleObject)]
pub struct Product {
    pub id: i32,
    pub name: String,
}

#[derive(InputObject)]
pub struct NewProduct {
    pub name: String,
}

#[Object]
impl ProductQuery {
    /// Returns a single product with the specified id.
    async fn get_product(&self, context: &Context<'_>, id: i32) -> Result<Product> {
        let product = sqlx::query!("SELECT id, name FROM products WHERE id = $1", id)
            .fetch_one(context.data::<PgPool>().unwrap())
            .await?;
        Ok(Product {
            id: product.id,
            name: product.name,
        })
    }

    /// Returns all the products.
    async fn get_products(&self, context: &Context<'_>) -> Result<Vec<Product>> {
        let products = sqlx::query!("SELECT id, name FROM products")
            .fetch_all(context.data::<PgPool>().unwrap())
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

#[Object]
impl ProductMutation {
    async fn create_product(&self, context: &Context<'_>, name: String) -> Result<Product> {
        let row = sqlx::query!("INSERT INTO products (name) VALUES ($1) RETURNING id", name)
            .fetch_one(context.data::<PgPool>().unwrap())
            .await?;

        Ok(Product { id: row.id, name })
    }
}
