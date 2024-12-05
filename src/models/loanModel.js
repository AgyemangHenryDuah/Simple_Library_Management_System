const db = require('../config/database');

class Loan {
  static async create(bookId, memberId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check book availability
      const [availabilityCheck] = await connection.execute(`
        SELECT 
          copies_owned - COUNT(DISTINCT CASE WHEN l.returned_date IS NULL THEN l.id END) as available_copies
        FROM book b
        LEFT JOIN loan l ON b.id = l.book_id
        WHERE b.id = ?
        GROUP BY b.id, b.copies_owned
      `, [bookId]);

      if (!availabilityCheck[0] || availabilityCheck[0].available_copies <= 0) {
        throw new Error('Book not available');
      }

      // Create loan record
      const loanDate = new Date();
      const [result] = await connection.execute(
        'INSERT INTO loan (book_id, member_id, loan_date) VALUES (?, ?, ?)',
        [bookId, memberId, loanDate]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getMemberLoans(memberId) {
    const query = `
      SELECT 
        l.id,
        b.title,
        c.category_name,
        l.loan_date,
        DATE_ADD(l.loan_date, INTERVAL 14 DAY) as due_date
      FROM loan l
      JOIN book b ON l.book_id = b.id
      JOIN category c ON b.category_id = c.id
      WHERE l.member_id = ? AND l.returned_date IS NULL
      ORDER BY due_date ASC
    `;
    const [rows] = await db.execute(query, [memberId]);
    return rows;
  }
}

module.exports = Loan;