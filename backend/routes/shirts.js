const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { validateShirt, validateId } = require('../middleware/validation');

// GET /api/shirts - listar com paginação e filtros
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 8));
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : null;
    const category = req.query.category || null;
    const featured = req.query.featured === 'true' ? 1 : null;

    let where = ['active = 1'];
    let params = [];

    if (search) {
      where.push('(name LIKE ? OR club LIKE ? OR country LIKE ?)');
      params.push(search, search, search);
    }
    if (category) {
      where.push('category = ?');
      params.push(category);
    }
    if (featured !== null) {
      where.push('featured = ?');
      params.push(featured);
    }

    const whereClause = 'WHERE ' + where.join(' AND ');

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM shirts ${whereClause}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT * FROM shirts ${whereClause} ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar camisas.' });
  }
});

// GET /api/shirts/featured - destaques
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM shirts WHERE featured = 1 AND active = 1 ORDER BY created_at DESC LIMIT 6'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar destaques.' });
  }
});

// GET /api/shirts/:id - detalhes de uma camisa
router.get('/:id', validateId, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shirts WHERE id = ? AND active = 1', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Camisa não encontrada.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar camisa.' });
  }
});

// POST /api/shirts - criar nova camisa
router.post('/', validateShirt, async (req, res) => {
  try {
    const {
      name, club, country, season, price, original_price,
      description, sizes, colors, stock, category, featured
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO shirts (name, club, country, season, price, original_price, description, sizes, colors, stock, category, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(), club.trim(), country.trim(), season.trim(),
        Number(price), original_price ? Number(original_price) : null,
        description || null,
        JSON.stringify(sizes || ['P','M','G','GG']),
        JSON.stringify(colors || ['Branco']),
        Number(stock), category, featured ? 1 : 0
      ]
    );

    const [newShirt] = await pool.query('SELECT * FROM shirts WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newShirt[0], message: 'Camisa cadastrada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar camisa.' });
  }
});

// PUT /api/shirts/:id - atualizar camisa
router.put('/:id', validateId, validateShirt, async (req, res) => {
  try {
    const {
      name, club, country, season, price, original_price,
      description, sizes, colors, stock, category, featured, active
    } = req.body;

    const [check] = await pool.query('SELECT id FROM shirts WHERE id = ?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ success: false, message: 'Camisa não encontrada.' });

    await pool.query(
      `UPDATE shirts SET name=?, club=?, country=?, season=?, price=?, original_price=?,
       description=?, sizes=?, colors=?, stock=?, category=?, featured=?, active=?
       WHERE id=?`,
      [
        name.trim(), club.trim(), country.trim(), season.trim(),
        Number(price), original_price ? Number(original_price) : null,
        description || null,
        JSON.stringify(sizes || ['P','M','G','GG']),
        JSON.stringify(colors || ['Branco']),
        Number(stock), category, featured ? 1 : 0,
        active !== undefined ? (active ? 1 : 0) : 1,
        req.params.id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM shirts WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0], message: 'Camisa atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar camisa.' });
  }
});

// DELETE /api/shirts/:id - soft delete
router.delete('/:id', validateId, async (req, res) => {
  try {
    const [check] = await pool.query('SELECT id FROM shirts WHERE id = ? AND active = 1', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ success: false, message: 'Camisa não encontrada.' });

    await pool.query('UPDATE shirts SET active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Camisa removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao remover camisa.' });
  }
});

module.exports = router;
