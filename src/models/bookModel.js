const db = require('../config/database');

class Book {
  static async getAllAvailable() {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.publication_date,
        c.category_name,
        GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name)) as authors,
        b.copies_owned - COUNT(DISTINCT CASE WHEN l.returned_date IS NULL THEN l.id END) as available_copies
      FROM book b
      LEFT JOIN category c ON b.category_id = c.id
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN author a ON ba.author_id = a.id
      LEFT JOIN loan l ON b.id = l.book_id
      GROUP BY b.id, b.title, b.publication_date, c.category_name
      HAVING available_copies > 0
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getBookDetails(bookId) {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.publication_date,
        c.category_name,
        GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name)) as authors,
        b.copies_owned,
        b.copies_owned - COUNT(DISTINCT CASE WHEN l.returned_date IS NULL THEN l.id END) as available_copies
      FROM book b
      LEFT JOIN category c ON b.category_id = c.id
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN author a ON ba.author_id = a.id
      LEFT JOIN loan l ON b.id = l.book_id
      WHERE b.id = ?
      GROUP BY b.id, b.title, b.publication_date, c.category_name
    `;
    const [rows] = await db.execute(query, [bookId]);
    return rows[0];
  }
}

module.exports = Book;