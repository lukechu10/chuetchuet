-- Add up migration script here
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
)
