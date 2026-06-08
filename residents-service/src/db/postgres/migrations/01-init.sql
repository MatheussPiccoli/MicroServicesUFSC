CREATE TABLE residents (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    locker_id UUID NOT NULL,
    password VARCHAR(100) NOT NULL
);