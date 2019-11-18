INSERT INTO accountants
  (name, company, email, password)
VALUES
  ('Ahmed Murad', 'The best in town', 'a.murad@nomail.com', '12345678'),
  ('Lucas Wilson', 'The best in town', 'l.wilson@nomail.com', '12345678'),
  ('Amanda Shalansky', 'The best in town', 'a.shalansky@nomail.com', '12345678'),
  ('Russell McWhae', 'The best in town', 'r.mcwhae@nomail.com', '12345678');

INSERT INTO users
  (name, email, password)
VALUES
  ('Ahmed Murad', 'a.murad@nomail.com', '12345678'),
  ('Lucas Wilson', 'l.wilson@nomail.com', '12345678'),
  ('Amanda Shalansky', 'a.shalansky@nomail.com', '12345678'),
  ('Russell McWhae', 'r.mcwhae@nomail.com', '12345678');

INSERT INTO files
  (name, user_id)
VALUES
  ('a.murad@nomail.com', 1),
  ('l.wilson@nomail.com', 2);

  INSERT INTO category
  (name, file_id, acct_id, user_id)
VALUES
  ('personal', 1, 3, 1),
  ('company', 2, 4, 2);

  INSERT INTO reciepts
  (upload_date, purchase_date, category_id, user_id)
VALUES
  ('Oct. 12, 2019', 'Oct. 12, 2019', 1, 1),
  ('Oct. 15, 2019', 'Oct. 15, 2019', 2, 1);