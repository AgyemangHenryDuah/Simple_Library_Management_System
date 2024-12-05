const db = require('../config/database');

class Admin {
  static async getAllBooks() {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.publication_date,
        c.category_name,
        b.copies_owned,
        GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name)) as authors
      FROM book b
      LEFT JOIN category c ON b.category_id = c.id
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN author a ON ba.author_id = a.id
      GROUP BY b.id, b.title, b.publication_date, c.category_name
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getCategories() {
    const [rows] = await db.execute('SELECT * FROM category');
    return rows;
  }

  static async getAuthors() {
    const [rows] = await db.execute('SELECT * FROM author');
    return rows;
  }

  static async addBook(title, categoryId, publicationDate, copiesOwned, authorIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert book
      const [bookResult] = await connection.execute(
        'INSERT INTO book (title, category_id, publication_date, copies_owned) VALUES (?, ?, ?, ?)',
        [title, categoryId, publicationDate, copiesOwned]
      );

      // Insert book-author relationships
      for (const authorId of authorIds) {
        await connection.execute(
          'INSERT INTO book_author (book_id, author_id) VALUES (?, ?)',
          [bookResult.insertId, authorId]
        );
      }

      await connection.commit();
      return bookResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateBook(bookId, title, categoryId, publicationDate, copiesOwned, authorIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update book
      await connection.execute(
        'UPDATE book SET title = ?, category_id = ?, publication_date = ?, copies_owned = ? WHERE id = ?',
        [title, categoryId, publicationDate, copiesOwned, bookId]
      );

      // Delete existing book-author relationships
      await connection.execute('DELETE FROM book_author WHERE book_id = ?', [bookId]);

      // Insert new book-author relationships
      for (const authorId of authorIds) {
        await connection.execute(
          'INSERT INTO book_author (book_id, author_id) VALUES (?, ?)',
          [bookId, authorId]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteBook(bookId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete book-author relationships
      await connection.execute('DELETE FROM book_author WHERE book_id = ?', [bookId]);
      
      // Delete book
      await connection.execute('DELETE FROM book WHERE id = ?', [bookId]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Admin;