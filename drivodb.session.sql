USE drivo;
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);INSERT INTO client (
    id,
    full_name,
    cnic,
    age,
    phone_number,
    address,
    email,
    password
  )
VALUES (
    id:intINSERT INTO client (
        id,
        full_name,
        cnic,
        age,
        phone_number,
        address,
        email,
        password
      )
    VALUES (
        id:int,
        'full_name:varchar',
        'cnic:varchar',
        age:int,
        'phone_number:varchar',
        'address:text',
        'email:varchar',
        'password:varchar'
      );,
    'full_name:varchar',
    'cnic:varchar',
    age:int,
    'phone_number:varchar',
    'address:text',
    'email:varchar',
    'password:varchar'
  );
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
