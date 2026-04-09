-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS football_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE football_shop;

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
  image_url VARCHAR(500),
  sizes JSON NOT NULL DEFAULT '["P","M","G","GG"]',
  colors JSON NOT NULL DEFAULT '["Branco"]',
  stock INT NOT NULL DEFAULT 0,
  category ENUM('titular','reserva','treino','retrô','seleção') NOT NULL DEFAULT 'titular',
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO shirts (name, club, country, season, price, original_price, description, image_url, sizes, colors, stock, category, featured) VALUES
('Camisa Titular Flamengo 2024', 'Flamengo', 'Brasil', '2024/25', 299.90, 349.90, 'Camisa oficial do Flamengo para a temporada 2024/25. Tecido de alta performance com tecnologia DriFit. A camisa mais desejada do Brasil!', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', '["P","M","G","GG","XGG"]', '["Preto/Vermelho"]', 45, 'titular', TRUE),
('Camisa Titular Palmeiras 2024', 'Palmeiras', 'Brasil', '2024/25', 289.90, NULL, 'Camisa oficial do Palmeiras. Verde alviverde com escudo bordado. Material respirável para máximo conforto em campo.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', '["P","M","G","GG"]', '["Verde"]', 30, 'titular', TRUE),
('Camisa Reserva Real Madrid 2024', 'Real Madrid', 'Espanha', '2024/25', 449.90, 499.90, 'Camisa reserva do Real Madrid. Branco clássico dos Merengues com detalhes dourados. Tecnologia Adidas Climacool.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', '["P","M","G","GG"]', '["Branco","Dourado"]', 20, 'reserva', TRUE),
('Camisa Barcelona Retrô 2010', 'Barcelona', 'Espanha', '2010/11', 379.90, NULL, 'Camisa retrô do Barcelona, edição da temporada do Treble histórico de 2010/11. Colecionável e exclusiva.', 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600', '["P","M","G","GG"]', '["Azul/Grená"]', 15, 'retrô', FALSE),
('Camisa Seleção Brasileira 2022', 'Seleção Brasileira', 'Brasil', '2022', 399.90, 449.90, 'Camisa oficial da Seleção Brasileira para a Copa do Mundo 2022. Amarela com detalhes verdes e escudo da CBF.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600', '["PP","P","M","G","GG","XGG"]', '["Amarelo/Verde"]', 60, 'seleção', TRUE),
('Camisa Liverpool 2024', 'Liverpool', 'Inglaterra', '2024/25', 419.90, NULL, 'Camisa do Liverpool para 2024/25. Vermelho clássico dos Reds com sponsor padrão. You''ll Never Walk Alone.', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600', '["P","M","G","GG"]', '["Vermelho"]', 25, 'titular', FALSE),
('Camisa Manchester City 2024', 'Manchester City', 'Inglaterra', '2024/25', 429.90, 479.90, 'Camisa do Manchester City, os atuais campeões europeus. Azul celeste com detalhes brancos.', 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600', '["P","M","G","GG"]', '["Azul"]', 18, 'titular', TRUE),
('Camisa Corinthians Treino 2024', 'Corinthians', 'Brasil', '2024', 189.90, 219.90, 'Camisa de treino oficial do Corinthians. Material leve e confortável para os treinos do Timão.', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600', '["P","M","G","GG"]', '["Preto","Branco"]', 40, 'treino', FALSE);
