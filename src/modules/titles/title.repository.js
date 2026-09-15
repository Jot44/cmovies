const pool = require("../../config/database.js");

async function create(dados) {
  const result = await pool.query(
    `INSERT INTO titles (name, type, genre, release_year, rating, status) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      dados.name,
      dados.type,
      dados.genre,
      dados.release_year,
      dados.rating,
      dados.status,
    ],
  );

  return result.rows[0];
}

async function findAll() {
  const result = await pool.query(`SELECT * FROM titles`);

  return result.rows;
}

async function findById(id) {
  const result = await pool.query(`SELECT * FROM titles WHERE id = $1`, [id]);

  return result.rows[0] || null;
}

async function update(id, dados) {
  const result = await pool.query(
    `UPDATE titles SET name = $1, type = $2, genre = $3, release_year = $4, rating = $5, status = $6 WHERE id = $7 RETURNING *`,
    [
      dados.name,
      dados.type,
      dados.genre,
      dados.release_year,
      dados.rating,
      dados.status,
      id,
    ],
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query(`DELETE FROM titles WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { create, findAll, findById, update, remove };
