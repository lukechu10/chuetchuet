mod graph;

use anyhow::Result;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::EmptySubscription;
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use graph::auth::AuthInfo;
use graph::{MutationRoot, QueryRoot};
use rocket::response::content;
use rocket::{catch, catchers, get, routes, State};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

pub type DbPool = Pool<Postgres>;
pub type Schema = async_graphql::Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[catch(404)]
fn not_found() -> &'static str {
    "404 Not Found"
}

#[get("/")]
fn graphiql() -> content::RawHtml<String> {
    content::RawHtml(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

#[rocket::get("/graphql?<query..>")]
async fn get_graphql_handler(
    query: GraphQLQuery,
    schema: &State<Schema>,
    auth: AuthInfo,
) -> GraphQLResponse {
    let request: GraphQLRequest = query.into();
    request.data(auth).execute(&*schema).await
}

#[rocket::post("/graphql", data = "<request>", format = "application/json")]
async fn post_graphql_handler(
    request: GraphQLRequest,
    schema: &State<Schema>,
    auth: AuthInfo,
) -> GraphQLResponse {
    request.data(auth).execute(&*schema).await
}

#[rocket::main]
async fn main() -> Result<()> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://myuser:pass1234@localhost/db")
        .await?;

    sqlx::migrate!().run(&pool).await?;

    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(pool)
    .finish();

    let _rocket = rocket::build()
        .manage(schema)
        .mount(
            "/",
            routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .register("/", catchers![not_found])
        .launch()
        .await?;

    Ok(())
}
