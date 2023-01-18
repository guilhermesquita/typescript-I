-- Active: 1674057898398@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users(id, email, password)
VALUES('A01', 'email@gmail.com', '8503Ac.');

INSERT INTO users(id, email, password)
VALUES('A02', 'mail@email.com', 'Trgd_2');

INSERT INTO users(id, email, password)
VALUES('A03', 'email@mail.net', 'Manaus10');

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products(id, name, price, category)
VALUES('PD01', 'Óculos de sol', 60, 'Acessórios');

INSERT INTO products(id, name, price, category)
VALUES('PD02', 'Uncharted: A Thief´s End', 220.90, 'Eletrônicos');

INSERT INTO products(id, name, price, category)
VALUES('PD03', 'Casaco Nike', 120.99, 'Roupas e calçados');

INSERT INTO products(id, name, price, category)
VALUES('PD04', 'Chuteira Filla', 230.50, 'Roupas e calçados');

INSERT INTO products(id, name, price, category)
VALUES('PD05', 'Mouse Logitech', 210.49, 'Eletrônicos');

SELECT * FROM products;