const validateShirt = (req, res, next) => {
  const { name, club, country, season, price, stock, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3)
    errors.push('Nome deve ter pelo menos 3 caracteres.');
  if (!club || club.trim().length < 2)
    errors.push('Clube é obrigatório.');
  if (!country || country.trim().length < 2)
    errors.push('País é obrigatório.');
  if (!season || season.trim().length < 4)
    errors.push('Temporada é obrigatória (ex: 2024/25).');
  if (!price || isNaN(price) || Number(price) <= 0)
    errors.push('Preço deve ser um número positivo.');
  if (stock === undefined || isNaN(stock) || Number(stock) < 0)
    errors.push('Estoque deve ser um número não-negativo.');

  const validCategories = ['titular', 'reserva', 'treino', 'retrô', 'seleção'];
  if (!category || !validCategories.includes(category))
    errors.push(`Categoria inválida. Use: ${validCategories.join(', ')}.`);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }
  req.params.id = id;
  next();
};

module.exports = { validateShirt, validateId };
