CREATE TABLE logs (
    id UUID PRIMARY KEY,
    delivery VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    locker_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (
        action IN (
            'PACKAGE_STORED',
            'PACKAGE_COLLECTED',
            'DOOR_OPENED'
        )
    )
);