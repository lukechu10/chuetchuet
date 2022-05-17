use rocket::{catch, catchers, get, launch, routes};

#[catch(404)]
fn not_found() -> &'static str {
    "404 Not Found"
}

#[get("/")]
fn index() -> &'static str {
    "Terra Noun API"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .register("/", catchers![not_found])
}
