CREATE TABLE IF NOT EXISTS classrooms (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          name VARCHAR(10) NOT NULL,
    grade INT NOT NULL
    );

CREATE TABLE IF NOT EXISTS students (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    classroom_id BIGINT,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
    );