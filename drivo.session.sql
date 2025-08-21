USE drivodb;

-- ✅ Custom User Table (stores cnic)
CREATE TABLE drivo_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE, -- can store email
    email VARCHAR(254) NOT NULL UNIQUE,     -- login by email
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_driver BOOLEAN DEFAULT FALSE,
    is_client BOOLEAN DEFAULT FALSE       -- only for drivers
    
);

-- ✅ Admin Table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ✅ Client Table (linked to drivo_user)
CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NULL,
    cnic VARCHAR(15) NULL,
    age INT NULL,
    phone_number VARCHAR(15) NULL,
    address TEXT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    dp VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES drivo_user(id)
);


-- ✅ Driver Table (linked to drivo_user)
CREATE TABLE driver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    full_name VARCHAR(100),
    age INT,
    phone_number VARCHAR(15),
    city VARCHAR(100), NULL
    license_number VARCHAR(50),NULL
    license_expiry DATE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES drivo_user(id)
);

-- ✅ Ride Table
CREATE TABLE ride (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    driver_id INT,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    trip_type ENUM('one-way', 'round-trip'),
    vehicle_type VARCHAR(50),
    fare DECIMAL(10, 2),
    status ENUM('requested', 'accepted', 'completed', 'cancelled') DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
);

-- ✅ Payment Table
CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT,
    client_id INT,
    amount DECIMAL(10,2),
    method ENUM('JazzCash', 'EasyPaisa', 'Bank Transfer', 'Cash'),
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES ride(id),
    FOREIGN KEY (client_id) REFERENCES client(id)
);

-- ✅ Review Table
CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT,
    client_id INT,
    driver_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES ride(id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (driver_id) REFERENCES driver(id)
);
