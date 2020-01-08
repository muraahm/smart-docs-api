INSERT INTO accountants
  (name, company, email, password)
VALUES
  ('Ahmed Murad', 'Careful Counting', 'a.murad@nomail.com', '12345678'),
  ('Lucas Wilson', 'Money Measured', 'l.wilson@nomail.com', '12345678'),
  ('Amanda Shalansky', 'Penny Pinchers', 'a.shalansky@nomail.com', '12345678'),
  ('Russell McWhae', 'Target Number', 'r.mcwhae@nomail.com', '12345678');

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
  (upload_date, name, category_id, user_id)
VALUES
  ('Oct. 12, 2019', 'Oct. 12, 2019', 1, 1),
  ('Oct. 15, 2019', 'Oct. 15, 2019', 2, 1);