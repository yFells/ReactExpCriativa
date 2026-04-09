-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS futebol_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE futebol_shop;

-- Tabela de camisas
CREATE TABLE IF NOT EXISTS shirts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  club VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  season VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  description TEXT,
  sizes JSON NOT NULL,
  colors JSON NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category ENUM('titular','reserva','treino','retrô','seleção') NOT NULL DEFAULT 'titular',
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger para default de sizes e colors
DELIMITER $$
CREATE TRIGGER before_shirt_insert
BEFORE INSERT ON shirts
FOR EACH ROW
BEGIN
  IF NEW.sizes IS NULL THEN
    SET NEW.sizes = '["P","M","G","GG"]';
  END IF;
  IF NEW.colors IS NULL THEN
    SET NEW.colors = '["Branco"]';
  END IF;
END$$
DELIMITER ;

-- Inserir dados de exemplo
INSERT INTO shirts (name, club, country, season, price, original_price, description, sizes, colors, stock, category, featured) VALUES
('Camisa Titular Flamengo 2024', 'Flamengo', 'Brasil', '2024/25', 299.90, 349.90, 'Camisa oficial do Flamengo para a temporada 2024/25. Tecido de alta performance com tecnologia DriFit. A camisa mais desejada do Brasil!', '["P","M","G","GG","XGG"]', '["Preto/Vermelho"]', 45, 'titular', TRUE),
('Camisa Titular Palmeiras 2024', 'Palmeiras', 'Brasil', '2024/25', 289.90, NULL, 'Camisa oficial do Palmeiras. Verde alviverde com escudo bordado. Material respirável para máximo conforto em campo.', '["P","M","G","GG"]', '["Verde"]', 30, 'titular', TRUE),
('Camisa Reserva Real Madrid 2024', 'Real Madrid', 'Espanha', '2024/25', 449.90, 499.90, 'Camisa reserva do Real Madrid. Branco clássico dos Merengues com detalhes dourados. Tecnologia Adidas Climacool.', '["P","M","G","GG"]', '["Branco","Dourado"]', 20, 'reserva', TRUE),
('Camisa Barcelona Retrô 2010', 'Barcelona', 'Espanha', '2010/11', 379.90, NULL, 'Camisa retrô do Barcelona, edição da temporada do Treble histórico de 2010/11. Colecionável e exclusiva.', '["P","M","G","GG"]', '["Azul/Grená"]', 15, 'retrô', FALSE),
('Camisa Seleção Brasileira 2022', 'Seleção Brasileira', 'Brasil', '2022', 399.90, 449.90, 'Camisa oficial da Seleção Brasileira para a Copa do Mundo 2022. Amarela com detalhes verdes e escudo da CBF.', '["PP","P","M","G","GG","XGG"]', '["Amarelo/Verde"]', 60, 'seleção', TRUE),
('Camisa Liverpool 2024', 'Liverpool', 'Inglaterra', '2024/25', 419.90, NULL, 'Camisa do Liverpool para 2024/25. Vermelho clássico dos Reds com sponsor padrão. You''ll Never Walk Alone.', '["P","M","G","GG"]', '["Vermelho"]', 25, 'titular', FALSE),
('Camisa Manchester City 2024', 'Manchester City', 'Inglaterra', '2024/25', 429.90, 479.90, 'Camisa do Manchester City, os atuais campeões europeus. Azul celeste com detalhes brancos.', '["P","M","G","GG"]', '["Azul"]', 18, 'titular', TRUE),
('Camisa Corinthians Treino 2024', 'Corinthians', 'Brasil', '2024', 189.90, 219.90, 'Camisa de treino oficial do Corinthians. Material leve e confortável para os treinos do Timão.', '["P","M","G","GG"]', '["Preto","Branco"]', 40, 'treino', FALSE);