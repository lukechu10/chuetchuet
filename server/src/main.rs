mod schema;

use anyhow::Result;
use juniper::EmptySubscription;
use rocket::response::content;
use rocket::{catch, catchers, get, routes, State};
use schema::auth::AuthInfo;
use schema::{Context, Mutation, Query, Schema};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

pub type DbPool = Pool<Postgres>;

#[catch(404)]
fn not_found() -> &'static str {
    "404 Not Found"
}

#[get("/")]
fn graphiql() -> content::RawHtml<String> {
    juniper_rocket::graphiql_source("/graphql", None)
}

#[rocket::get("/graphql?<request>")]
async fn get_graphql_handler(
    pool: &State<DbPool>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
    auth: AuthInfo,
) -> juniper_rocket::GraphQLResponse {
    let context = Context {
        pool: (*pool).clone(),
        auth,
    };
    request.execute(&*schema, &context).await
}

#[rocket::post("/graphql", data = "<request>")]
async fn post_graphql_handler(
    pool: &State<DbPool>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
    auth: AuthInfo,
) -> juniper_rocket::GraphQLResponse {
    let context = Context {
        pool: (*pool).clone(),
        auth,
    };
    request.execute(&*schema, &context).await
}

#[rocket::main]
async fn main() -> Result<()> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://myuser:pass1234@localhost/db")
        .await?;

    sqlx::migrate!().run(&pool).await?;

    let _rocket = rocket::build()
        .manage(pool)
        .manage(Schema::new(
            Query,
            Mutation,
            EmptySubscription::<Context>::new(),
        ))
        .mount(
            "/",
            routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .register("/", catchers![not_found])
        .launch()
        .await?;

    Ok(())
}
