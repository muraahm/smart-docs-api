DROP TABLE IF EXISTS accountants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS reciepts CASCADE;

CREATE TABLE accountants (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  acct_id INTEGER REFERENCES accountants(id) ON DELETE CASCADE
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY NOT NULL,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  acct_id INTEGER REFERENCES accountants(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reciepts (
  id SERIAL PRIMARY KEY NOT NULL,
  upload_date VARCHAR(255) NOT NULL,
  purchase_date VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES category(id) ON DELETE CASCADE
);