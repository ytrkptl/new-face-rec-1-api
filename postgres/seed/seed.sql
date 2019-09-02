BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined, pet, age) values ('a', 'a@a.com', 5, '2019-08-12', 'dragon', 60);
INSERT into login(hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'a@a.com');

COMMIT;