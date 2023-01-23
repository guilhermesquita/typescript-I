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

SELECT * FROM users;

INSERT INTO products(id, name, price, category)
VALUES('PD06', 'Brincos Prateados', 70, 'Acessórios');

INSERT INTO users(id, email, password)
VALUES('A04', 'mynewemail@hotmail.com', 'sabred3_luz');

SELECT * FROM users
WHERE id = "A04";

DELETE FROM users
WHERE id = "A04";

DELETE FROM products
WHERE id = "PD06";

SELECT * FROM users;

UPDATE users
SET email = "myemail@yahoo.com"
WHERE id =  "A02";

SELECT * FROM products;

UPDATE products
SET price = 48.60
WHERE id = "PD01";

SELECT * FROM users
ORDER BY email ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

SELECT * FROM products
WHERE price >= 90 AND price < 230;

CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users (id)
);

DROP TABLE purchases;

INSERT INTO purchases(id, total_price, paid, buyer_id)
VALUES('PRC_1', 210.49, 0, 'A01' ),
      ('PRC_2', 120.10, 0, 'A01' ),
      ('PRC_3', 310, 0, 'A02' ),
      ('PRC_4', 210.49, 0, 'A02' ),
      ('PRC_5', 128.99, 0, 'A03' ),
      ('PRC_6', 128.30, 0, 'A03' )
;

UPDATE purchases
SET delivered_at = DATETIME('now', 'localtime');

SELECT users.id AS id_User, purchases.id AS id_Purchase, purchases.total_price, 
purchases.paid, purchases.delivered_at, 
users.email, users.password FROM purchases
INNER JOIN users
ON users.id = purchases.buyer_id
ORDER BY buyer_id ASC;

CREATE TABLE purchases_products(
    purchase_id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(purchase_id ) REFERENCES purchases(id)
);

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES('PRC_1', 'PD05', 2),
      ('PRC_3', 'PD02', 3),
      ('PRC_5', 'PD01', 1);

SELECT * FROM purchases_products;

SELECT purchases_products.purchase_id, purchases_products.product_id, 
purchases_products.quantity, purchases.total_price, purchases.delivered_at,
purchases.buyer_id FROM purchases_products
INNER JOIN purchases
ON purchases.id = purchases_products.purchase_id ;

DROP TABLE purchases_products