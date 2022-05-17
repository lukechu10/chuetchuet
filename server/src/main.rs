mod schema;

use juniper::EmptySubscription;
use rocket::response::content;
use rocket::{catch, catchers, get, launch, routes, State};
use schema::{Context, Mutation, Query, Schema};

#[catch(404)]
fn not_found() -> &'static str {
    "404 Not Found"
}

#[get("/")]
fn graphiql() -> content::RawHtml<String> {
    juniper_rocket::graphiql_source("/graphql", None)
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    context: &State<Context>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&**schema, &*context)
}

#[rocket::post("/graphql", data = "<request>")]
fn post_graphql_handler(
    context: &State<Context>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(Context {})
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
}
