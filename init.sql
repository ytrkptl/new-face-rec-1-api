BEGIN TRANSACTION;

CREATE TABLE login (
  id serial PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email text UNIQUE NOT NULL
);

COMMIT;

BEGIN TRANSACTION;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email text UNIQUE NOT NULL,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL,
  pet VARCHAR(100) DEFAULT 'None',
  age SMALLINT DEFAULT 1 CHECK (age > 0)
);

COMMIT;

BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined, pet, age) values ('a', 'a@a.com', 5, '2019-08-12', 'dragon', 60);
INSERT into login(hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'a@a.com');

COMMIT;