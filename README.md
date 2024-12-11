# Library Management System

## Overview
The Library Management System is designed to streamline the borrowing and tracking of books in a library. The system connects to an existing MySQL database and provides an easy-to-use interface for library members and administrators. Built using the MVC architecture, the backend is implemented in Node.js, and the frontend utilizes EJS for server-side rendering.

---

## Features

### Library Member Features
- **View Available Books**: Browse a list of books currently available for borrowing, including details such as titles, authors, categories, publication dates, and available copies.
- **View Book Details**: Access detailed information about a specific book, including its category and authors.
- **Borrow a Book**: Borrow books if they are available, with a due date set 14 days from the borrow date.
- **View Borrowed Books**: See a list of currently borrowed books, their due dates, and statuses.

### Developer Features
- Integration with an existing MySQL database using `mysql2` with a pool.
- Access to the database creation script for enhanced querying and schema visualization.
- Implementation of reliable queries for fetching available books, book details, and member loans, as well as creating loan records.
- Use of transactions to ensure consistency during borrowing operations.

---

## Technical Specifications

### Backend
- **Language**: Node.js
- **Database Library**: `mysql2` (with connection pooling)
- **Architecture**: MVC (Model-View-Controller)

### Frontend
- **Template Engine**: EJS (Embedded JavaScript)
- **Rendering**: Server-side

### System Scope
- No authentication system (features are publicly accessible).

---

## Database Integration
The system connects to an existing MySQL database. The database script is available to developers for visualization and understanding of table relationships.

### Example Tables:
- **book**: Stores book details (id, title, category_id, copies_owned).
- **author**: Stores author details (id, first_name, last_name).
- **book_author**: Maps books to authors.
- **category**: Stores book categories.
- **loan**: Tracks borrowed books (member_id, book_id, borrow_date, due_date, returned_date).

---

## Installation and Setup

### Prerequisites
- Node.js
- MySQL server
- A text editor or IDE

### Steps
1. **Clone the Repository**:
   ```bash
   git clone [https://github.com/AgyemangHenryDuah/Simple_Library_Management_System.git]
   cd library-management-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Database Connection**:
   - Configure the database connection in the `config/database.js` file.
   - Example configuration:
     ```javascript
     const mysql = require('mysql2');

     const pool = mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: 'yourpassword',
       database: 'library_db',
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
     });

     module.exports = pool.promise();
     ```

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000` for normal members.
   - Open your browser and navigate to `http://localhost:3000/admin` for librarian.

---

## Usage

### Viewing Available Books
- Navigate to the homepage to see a list of all books available for borrowing.

### Viewing Book Details
- Click on a book to view its detailed information.

### Borrowing a Book
- Click the "Borrow" button on a book’s details page to borrow it. The system will ensure availability before proceeding.

### Viewing Borrowed Books
- Navigate to the "My Loans" section to view your currently borrowed books and their due dates.

---

## Database Schema Script
Here is the SQL script to create the database schema:

```sql
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);

CREATE TABLE book (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publication_date DATE,
  category_id INT,
  copies_owned INT DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE author (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE book_author (
  book_id INT,
  author_id INT,
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id) REFERENCES book(id),
  FOREIGN KEY (author_id) REFERENCES author(id)
);

CREATE TABLE loan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  returned_date DATE,
  FOREIGN KEY (book_id) REFERENCES book(id)
);
```

---

## Contribution Guidelines
- Fork the repository.
- Create a feature branch.
- Commit changes with clear messages.
- Open a pull request for review.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
