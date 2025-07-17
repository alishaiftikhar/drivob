USE drivo;

-- User Table (from AbstractUser)
CREATE TABLE IF NOT EXISTS drivo_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254),
    password VARCHAR(128) NOT NULL,
    is_driver BOOLEAN DEFAULT FALSE,
    is_client BOOLEAN DEFAULT FALSE
    -- plus other fields from AbstractUser like last_login, is_active etc.
);

-- DriverProfile
CREATE TABLE IF NOT EXISTS drivo_driverprofile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    full_name VARCHAR(100),
    cnic VARCHAR(15),
    age INT,
    phone_number VARCHAR(15),
    city VARCHAR(50),
    driving_license VARCHAR(50),
    license_expiry DATE,
    FOREIGN KEY (user_id) REFERENCES drivo_user(id)
);

-- ClientProfile
CREATE TABLE IF NOT EXISTS drivo_clientprofile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    full_name VARCHAR(100),
    cnic VARCHAR(15),
    age INT,
    phone_number VARCHAR(15),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES drivo_user(id)
);

-- Ride Table
CREATE TABLE IF NOT EXISTS drivo_ride (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    driver_id INT,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    trip_type ENUM('one-way', 'round-trip'),
    vehicle_type VARCHAR(50),
    fare DECIMAL(10,2),
    status ENUM('requested', 'accepted', 'completed', 'cancelled') DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id),
    FOREIGN KEY (driver_id) REFERENCES drivo_driverprofile(id)
);

-- Payment Table
CREATE TABLE IF NOT EXISTS drivo_payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT,
    client_id INT,
    amount DECIMAL(10,2),
    method ENUM('JazzCash', 'EasyPaisa', 'Bank Transfer', 'Cash'),
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES drivo_ride(id),
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id)
);

-- Review Table
CREATE TABLE IF NOT EXISTS drivo_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT,
    client_id INT,
    driver_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES drivo_ride(id),
    FOREIGN KEY (client_id) REFERENCES drivo_clientprofile(id),
    FOREIGN KEY (driver_id) REFERENCES drivo_driverprofile(id)
);
