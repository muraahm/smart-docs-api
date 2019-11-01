INSERT INTO accountants
  (name, company, email, password)
VALUES
  ('Ahmed Murad', 'The best in town', 'a.murad@nomail.com', '12345678'),
  ('Lucas Wilson', 'The best in town', 'l.wilson@nomail.com', '12345678'),
  ('Amanda Shalansky', 'The best in town', 'a.shalansky@nomail.com', '12345678'),
  ('Russell McWhae', 'The best in town', 'r.mcwhae@nomail.com', '12345678');

INSERT INTO users
  (name, email, password, acct_id)
VALUES
  ('Ahmed Murad', 'a.murad@nomail.com', '12345678', 2),
  ('Lucas Wilson', 'l.wilson@nomail.com', '12345678', 3),
  ('Amanda Shalansky', 'a.shalansky@nomail.com', '12345678', 1),
  ('Russell McWhae', 'r.mcwhae@nomail.com', '12345678', 4);

INSERT INTO files
  (name, user_id)
VALUES
  ('1', 1),
  ('2', 2);

  INSERT INTO category
  (file_id, acct_id, user_id)
VALUES
  (1, 3, 1),
  (2, 4, 2);

  INSERT INTO reciepts
  (upload_date, purchase_date, category_id)
VALUES
  ('Oct. 12, 2019', 'Oct. 12, 2019', 1),
  ('Oct. 15, 2019', 'Oct. 15, 2019', 2);