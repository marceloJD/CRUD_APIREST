

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  password TEXT,
  photo TEXT,
  adress TEXT,
  role INTEGER
);

INSERT INTO users (name, password,photo, adress,role) VALUES
  ('User1', '123','BD/imgs/user.jpg','add1', 1),
  ('User2', '123','BD/imgs/user.jpg','add2', 2),
  ('User3', '123','BD/imgs/user.jpg','add3', 1);

CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE,
  total REAL,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO sales (date, total, user_id) VALUES
  ('2023-05-01', 10.0, 1);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price REAL,
  stock INTEGER
);

INSERT INTO products (name, price, stock) VALUES
  ('Product1', 10, 100),
  ('Product2', 20, 200),
  ('Product3', 30, 150);

CREATE TABLE sales_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO sales_details (sale_id, product_id, quantity) VALUES
  (1, 1, 1);


/*
-- Crear trigger para verificar el stock al insertar en sales_details
CREATE TRIGGER check_stock_insert
AFTER INSERT ON sales_details
FOR EACH ROW
BEGIN
  -- Verificar si hay suficiente stock
  SELECT CASE
    WHEN NEW.quantity <= (SELECT stock FROM products WHERE id = NEW.product_id) THEN
      -- Stock suficiente, no se hace nada
      NULL
    ELSE
      -- Stock insuficiente, lanzar un error
      RAISE(ABORT, 'Insufficient stock')
  END;
END;
*/

-- Crear trigger para actualizar el stock al insertar en sales_details
CREATE TRIGGER update_stock_insert
AFTER INSERT ON sales_details
FOR EACH ROW
BEGIN
  -- Actualizar el stock restando la cantidad vendida
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
END;
