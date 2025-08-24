-- First, drop the existing tables (this will delete all data)
DROP TABLE IF EXISTS drivo_review;
DROP TABLE IF EXISTS drivo_payment;
DROP TABLE IF EXISTS drivo_ride;
DROP TABLE IF EXISTS drivo_emailotp;
DROP TABLE IF EXISTS drivo_clientprofile;
DROP TABLE IF EXISTS drivo_driverprofile;
DROP TABLE IF EXISTS drivo_user;

<<<<<<< HEAD:drivo.session.sql
-- Now recreate all tables with the correct schema matching Django models
CREATE TABLE drivo_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    email VARCHAR(254) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_driver BOOLEAN DEFAULT FALSE,
    is_client BOOLEAN DEFAULT FALSE
);

CREATE TABLE drivo_clientprofile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NULL,
    cnic VARCHAR(15) NULL,
    age INT NULL,
    phone_number VARCHAR(15) NULL,
    address VARCHAR(255) NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    dp VARCHAR(100) NULL,
    FOREIGN KEY (user_id) REFERENCES drivo_user(id) ON DELETE CASCADE
);

CREATE TABLE drivo_driverprofile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NULL,
    cnic VARCHAR(15) NULL,
    age INT NULL,
    driving_license VARCHAR(50) NULL,
    license_expiry DATE NULL,
    phone_number VARCHAR(15) NULL,
    city VARCHAR(50) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES drivo_user(id) ON DELETE CASCADE
);

-- FIXED: driver_id is now NULL by default to match Django model
CREATE TABLE drivo_ride (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    driver_id BIGINT NULL,  -- FIXED: Now allows NULL values
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    pickup_latitude DECIMAL(9,6) NULL,
    pickup_longitude DECIMAL(9,6) NULL,
    dropoff_latitude DECIMAL(9,6) NULL,
    dropoff_longitude DECIMAL(9,6) NULL,
    scheduled_datetime DATETIME NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL DEFAULT 'petrol',
    trip_type VARCHAR(20) NOT NULL,
    fare DECIMAL(10,2) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'requested',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivo_driverprofile(id) ON DELETE SET NULL
);

CREATE TABLE drivo_payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ride_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES drivo_ride(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id) ON DELETE CASCADE
);

CREATE TABLE drivo_review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ride_id BIGINT NULL,  -- Made nullable to match Django model
    client_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment LONGTEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES drivo_ride(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivo_driverprofile(id) ON DELETE CASCADE
);

CREATE TABLE drivo_emailotp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add indexes for better performance
CREATE INDEX idx_drivo_ride_client ON drivo_ride(client_id);
CREATE INDEX idx_drivo_ride_driver ON drivo_ride(driver_id);
CREATE INDEX idx_drivo_ride_status ON drivo_ride(status);
CREATE INDEX idx_drivo_ride_created ON drivo_ride(created_at);
CREATE INDEX idx_drivo_emailotp_email ON drivo_emailotp(email);
CREATE INDEX idx_drivo_emailotp_created ON drivo_emailotp(created_at);
=======
-- Client table
CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    cnic VARCHAR(15) UNIQUE,
    age INT,
    phone_number VARCHAR(15),
    address TEXT,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Driver table
CREATE TABLE driver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    cnic VARCHAR(15) UNIQUE,
    age INT,
    phone_number VARCHAR(15),
    city VARCHAR(100),
    license_number VARCHAR(50),
    license_expiry DATE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Ride table
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

-- Payment table
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

-- Review table
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
>>>>>>> ed1f8b08f6c975d44c887c0355e61e9d44e44d10:drivo.session1.sql
