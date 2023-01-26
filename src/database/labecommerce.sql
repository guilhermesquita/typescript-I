-- Active: 1674057898398@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

INSERT INTO users(id, name, email, password)
VALUES('A01', 'Geovana Assis', 'geo_assis@gmail.com', '8503Ac.');

INSERT INTO users(id, name, email, password)
VALUES('A02', 'Lucas Magalhães','luquinha@mags@labemail.com', 'Trgd_2');

INSERT INTO users(id, name, email, password)
VALUES('A03', 'Rafael Buscacio', 'rafs_bus@mail.com', 'Manaus10');

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    imgUrl TEXT NOT NULL
);

DROP TABLE products;

INSERT INTO products(id, name, price, description, imgUrl)
VALUES('PD01', 'Óculos de Sol Rayban', 60, 'Acessório estiloso para o verão!', 'https://unsplash.com/photos/K62u25Jk6vo');

INSERT INTO products(id, name, price, description, imgUrl)
VALUES('PD02', 'Apple MacBook Air', 4500.99, 'Notebook MacBook Air - 16GB', 'https://unsplash.com/photos/yC-Yzbqy7PY');

INSERT INTO products(id, name, price, description, imgUrl)
VALUES('PD03', 'Camisa Fila', 120.99, 'Camisa azul marinho da marca fila', 'https://unsplash.com/photos/IiRqwBNVdTs');

INSERT INTO products(id, name, price, description, imgUrl)
VALUES('PD04', 'Chuteira Adidas Predator Freak.1 FG', 139.50, 'Chuteira de futebol (campo) Adidas predator branca', 'https://unsplash.com/photos/sC-AbZG-Sec');

INSERT INTO products(id, name, price, description, imgUrl)
VALUES('PD05', 'Mouse Gamer Logitech G203 RGB', 210.49, 'Mouse gamer RGB Logitech preto', 'https://unsplash.com/photos/5KQY5zDwVKM');

SELECT * FROM products;

SELECT * FROM users
ORDER BY email ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 3 OFFSET 1;

SELECT * FROM products
WHERE price >= 90 AND price < 230;

--------------------------------------FINALIZADO (ACIMA)-------------------------------

CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT,
    paid INTEGER NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

DROP TABLE purchases;

INSERT INTO purchases(id, buyer, total_price, created_at, paid)
VALUES('PRC_1', 'A01', 60, DATETIME('now', 'localtime'), 0),
      ('PRC_2', 'A03', 4500, DATETIME('now', 'localtime'), 0),
      ('PRC_3', 'A01', 139.5, DATETIME('now', 'localtime'), 0),
      ('PRC_4', 'A02', 210.49, DATETIME('now', 'localtime'), 0),
      ('PRC_5', 'A03', 60, DATETIME('now', 'localtime'), 0)
;

SELECT * FROM purchases;

UPDATE purchases
SET delivered_at = DATETIME('now', 'localtime');

CREATE TABLE purchases_products(
    purchase_id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(purchase_id ) REFERENCES purchases(id)
);

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES('PRC_1', 'PD01', 2),
      ('PRC_2', 'PD02', 3),
      ('PRC_3', 'PD04', 1),
      ('PRC_4', 'PD05', 1),
      ('PRC_5', 'PD01', 3);

SELECT * FROM purchases_products;

SELECT purchases.id, purchases_products.product_id, 
purchases_products.quantity, purchases.buyer, users.name, 
purchases.total_price * purchases_products.quantity  FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN users
ON purchases.buyer = users.id
;

DROP TABLE purchases_products;


SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = 'A01' AND 'A01' = users.id;

DROP TABLE products;
DROP TABLE users;
DROP TABLE purchases;
DROP TABLE purchases_products;