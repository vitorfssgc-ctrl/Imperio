const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ──────────────────────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'estoque.db');
const db = new Database(DB_PATH);

// Habilitar WAL para melhor performance
db.pragma('journal_mode = WAL');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT    NOT NULL,
    categoria  TEXT    NOT NULL DEFAULT 'FILIAL',
    quantidade INTEGER NOT NULL DEFAULT 0,
    minimo     INTEGER NOT NULL DEFAULT 0,
    preco      REAL    NOT NULL DEFAULT 0,
    unidade    TEXT    NOT NULL DEFAULT 'un',
    criado_em  TEXT    DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS movimentos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    prod_id    INTEGER NOT NULL,
    prod_nome  TEXT    NOT NULL,
    tipo       TEXT    NOT NULL CHECK(tipo IN ('add','sub')),
    delta      INTEGER NOT NULL,
    vendedor   TEXT,
    criado_em  TEXT    DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (prod_id) REFERENCES produtos(id) ON DELETE CASCADE
  );
`);

// Seed inicial se estiver vazio
const count = db.prepare('SELECT COUNT(*) as c FROM produtos').get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO produtos (nome, categoria, quantidade, minimo, preco, unidade)
    VALUES (@nome, @categoria, @quantidade, @minimo, @preco, @unidade)
  `);
  const seedMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });
  seedMany([
    { nome:'ARGAMASSA FUTURA AC3 CINZA 20KG', categoria:'FILIAL', quantidade:37, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA PLATINA 1KG', categoria:'FILIAL', quantidade:35, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA BEGE 1KG', categoria:'FILIAL', quantidade:57, minimo:5, preco:0, unidade:'un' },
    { nome:'ARGAMASSA FUTURA AC3 PISO SOBRE PISO 20KG', categoria:'FILIAL', quantidade:11, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA MARROM CAFE', categoria:'FILIAL', quantidade:27, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA FLEX GRAFITE 1KG', categoria:'FILIAL', quantidade:9, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA FLEX PRETO 1KG', categoria:'FILIAL', quantidade:80, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR A 66740 ESM 58X58', categoria:'FILIAL', quantidade:43, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA PALHA 1KG', categoria:'FILIAL', quantidade:22, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA FLEX MARROM', categoria:'FILIAL', quantidade:33, minimo:5, preco:0, unidade:'un' },
    { nome:'ARGAMASSA FUTURA AC2 20KG', categoria:'FILIAL', quantidade:39, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC TECNO A 58510 58X58 CIMENTO BRANCO', categoria:'FILIAL', quantidade:72, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA MARFIM 1KG', categoria:'FILIAL', quantidade:24, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63240 BEGE BR 63X63', categoria:'FILIAL', quantidade:14, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC TECNO A PTG 58500 58X58', categoria:'FILIAL', quantidade:216, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ARIELLE A RIVIERA BRANCO 36.5X58', categoria:'FILIAL', quantidade:35, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC TECNO C PTG 58500 58X58', categoria:'FILIAL', quantidade:28, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 62020 POL 62X62', categoria:'FILIAL', quantidade:99, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC TECNO A PPO58300 CALACATTA GOLD 58X58', categoria:'FILIAL', quantidade:72, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC DELTA A MADRID PLATA AC RET 84X84', categoria:'FILIAL', quantidade:48, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ARIELE A FLORIDA CLEAN 36.5X58.4 HD', categoria:'FILIAL', quantidade:89, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A RIVIERA BRANCO 67X67', categoria:'FILIAL', quantidade:60, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A IRIS LUX 67X67 RETIF', categoria:'FILIAL', quantidade:94, minimo:5, preco:0, unidade:'un' },
    { nome:'REV. INCENOR A 57030 32.5X57', categoria:'FILIAL', quantidade:40, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ESMALTADO B 57020 32.5X57', categoria:'FILIAL', quantidade:2, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ESMALTADO MORRO BRANCO AC 63X63 PSI-63230R A', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 66470 58X58', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'PORC ELIZABETH A URBAN SOFT AC 84X84 T.6513', categoria:'FILIAL', quantidade:120, minimo:5, preco:0, unidade:'un' },
    { nome:'POR ELIZABETH A LE BLANC AC 84X84', categoria:'FILIAL', quantidade:61, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ARIELLE A FLORIDA WHITE 36.5X58.4 RET', categoria:'FILIAL', quantidade:96, minimo:5, preco:0, unidade:'un' },
    { nome:'TINTA PISOS/FACHADAS VERDE 18L ELIT', categoria:'FILIAL', quantidade:5, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA EMBORRACHADA ELIT BRANCO 18KG', categoria:'FILIAL', quantidade:3, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PINTALIT PALHA LT 18L', categoria:'FILIAL', quantidade:3, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PINTALIT AREIA LT 18L ELIT', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PINTALIT BRANCO LT 18L', categoria:'FILIAL', quantidade:6, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PINTALIT CINZA ELEFANTE LT 18L', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'ESMALTE SINTETICO ALTO BRILHO CINZA MEDIO GL 3.6L', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'ESMALTE SINTETICO ALTO BRILHO TABACO GL 3.6L', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'ESMALTE SINTETICO BRANCO 900ML ELIT ALTO BRILHO', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS E FACHADAS BRANCO LT 18L', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS/FACHADAS AMARELO 18L ELIT DEMARCACAO', categoria:'FILIAL', quantidade:4, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS E FACHADAS CINZA CLARO LT 18L', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS/FACHADAS CAMURCA 18L ELIT', categoria:'FILIAL', quantidade:4, minimo:2, preco:0, unidade:'un' },
    { nome:'MASSA ACRILICA 12KG ELIT', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A RIVIERA BRANCO BR 67X67', categoria:'FILIAL', quantidade:53, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63080', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63230 AC 63X63', categoria:'FILIAL', quantidade:81, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C AC 63670', categoria:'FILIAL', quantidade:4, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A LISIANTO 67X67', categoria:'FILIAL', quantidade:94, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO CERAMICO 672X672 HD RETIF BEGONIA A', categoria:'FILIAL', quantidade:9, minimo:5, preco:0, unidade:'un' },
    { nome:'LIXA MASSA G150 TYRILIT', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'PULPIS CINZA ACET 83X83', categoria:'FILIAL', quantidade:96, minimo:5, preco:0, unidade:'un' },
    { nome:'REV. FORMIGRESS DECORE', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE CINTRA BEGE 84X84', categoria:'FILIAL', quantidade:25, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE CINTRA CINZA 84X84', categoria:'FILIAL', quantidade:45, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A FLOX 67X67', categoria:'FILIAL', quantidade:8, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE HIBISCO A 67X67', categoria:'FILIAL', quantidade:45, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE ALEXO A 83X83', categoria:'FILIAL', quantidade:21, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR B 57130 32.5X57', categoria:'FILIAL', quantidade:24, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR B 57230 32.5X57', categoria:'FILIAL', quantidade:28, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 66460 58X58', categoria:'FILIAL', quantidade:8, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 67020 58X58 BIANCO', categoria:'FILIAL', quantidade:14, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63410', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 58X58 66650', categoria:'FILIAL', quantidade:2, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE LIRIO LUX 67X67', categoria:'FILIAL', quantidade:19, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A LAREDO RET 67X67', categoria:'FILIAL', quantidade:100, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR A 66530', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'DUCHA FUTURA MULTI 127V/5500W BLIST', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A FRADES 83X83 PO', categoria:'FILIAL', quantidade:14, minimo:5, preco:0, unidade:'un' },
    { nome:'ESPACADOR CORTAG SLIM 2.0MM', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'CUNHA NIVELAMENTO SLIM CORTAG', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR A 57220 32.5X57', categoria:'FILIAL', quantidade:58, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR A 57180 32.5X57', categoria:'FILIAL', quantidade:0, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ESMAL BRANCO A 57010 32.5X57', categoria:'FILIAL', quantidade:187, minimo:5, preco:0, unidade:'un' },
    { nome:'FUNDO PREPARADOR GL 3.6L', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PINTALIT MARFIM LT 18L', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS/FACHADAS AZUL 18L ELIT', categoria:'FILIAL', quantidade:5, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ELIT AMARELO CAMARO 18L FOSCO SUPER RENDIMENTO', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ELIT TERRACOTA FOSCO 18L SUPER RENDIMENTO', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ELIT VERDE PISCINA FOSCO 18L SUPER RENDIMENTO', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ELIT CINZA CALACATA FOSCO 18L SUPER RENDIMENTO', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ELIT ALGODAO EGIPCIO FOSCO 18L SUPER RENDIMENTO', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'BORRACHA LIQUID ELIT PRETO 18L SEMIACETINADO', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'BORRACHA LIQUID ELIT CROMIO 18L SEMIACETINADO', categoria:'FILIAL', quantidade:6, minimo:2, preco:0, unidade:'un' },
    { nome:'BORRACHA LIQUID ELIT TERRACOTA 18L SEMIACETINADO', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA EMBORRA ELIT CINZA CLARO 18KG', categoria:'FILIAL', quantidade:4, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA EMBORRACHADA ELIT MARFIM 18KG', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'PISO INCENOR A 62010 POLIDO 62X62', categoria:'FILIAL', quantidade:52, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ARIELLE A CADIZ RET 365X584', categoria:'FILIAL', quantidade:89, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ARIELLE A FLORENCE 54X54', categoria:'FILIAL', quantidade:40, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO CERAL PETROLEO POLIDO 62X120', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 62010 62X62', categoria:'FILIAL', quantidade:98, minimo:5, preco:0, unidade:'un' },
    { nome:'PORCELANATO ESMALTADO ACETINADO RET BARCELONA SAND 84X84 DELTA', categoria:'FILIAL', quantidade:69, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR A 57270 32.5X57 MONACO ARENITO', categoria:'FILIAL', quantidade:57, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ARIELLE A DOVER 365X584MM RETIF', categoria:'FILIAL', quantidade:96, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63420', categoria:'FILIAL', quantidade:4, minimo:5, preco:0, unidade:'un' },
    { nome:'REV INCENOR B 57180 32.5X57', categoria:'FILIAL', quantidade:2, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 62030', categoria:'FILIAL', quantidade:262, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63610', categoria:'FILIAL', quantidade:2, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ESMALTADO 63840 C', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'REV ESMALTADO B 57270 MONAC', categoria:'FILIAL', quantidade:28, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO ESMALTADO C 63770', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA AREIA 1KG', categoria:'FILIAL', quantidade:7, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 62040 62X62', categoria:'FILIAL', quantidade:2, minimo:5, preco:0, unidade:'un' },
    { nome:'TINTA ACRI/PRO MOSTARDA 18L ELIT', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS E FACHADAS CINZA 18L', categoria:'FILIAL', quantidade:4, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA PISOS E FACHADAS VERMELHO 18L ELIT', categoria:'FILIAL', quantidade:6, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ACRI/PRO AREIA 18L ELIT', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ACRI/PRO PEROLA 18L ELIT', categoria:'FILIAL', quantidade:1, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ACRI/PRO MARFIM 18L ELIT', categoria:'FILIAL', quantidade:0, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA ACRI/PRO BRANCO NEVE 18L ELIT', categoria:'FILIAL', quantidade:6, minimo:2, preco:0, unidade:'un' },
    { nome:'PISO INCENOR 57420 32.5X57', categoria:'FILIAL', quantidade:213, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR A 66200 58X58', categoria:'FILIAL', quantidade:36, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR A 67140', categoria:'FILIAL', quantidade:105, minimo:5, preco:0, unidade:'un' },
    { nome:'TINTA EMBORRACHADA ELIT CONCRETO 18KG', categoria:'FILIAL', quantidade:3, minimo:2, preco:0, unidade:'un' },
    { nome:'TINTA EMBORRACHADA ELIT AREIA 18KG', categoria:'FILIAL', quantidade:3, minimo:2, preco:0, unidade:'un' },
    { nome:'BORRACHA LIQUIDA AREIA', categoria:'FILIAL', quantidade:3, minimo:2, preco:0, unidade:'un' },
    { nome:'BORRACHA LIQUIDA CAMURCA', categoria:'FILIAL', quantidade:2, minimo:2, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 66920', categoria:'FILIAL', quantidade:1, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR B 57010 BR 32.5X57', categoria:'FILIAL', quantidade:7, minimo:5, preco:0, unidade:'un' },
    { nome:'PISO INCENOR C 63040 63X63', categoria:'FILIAL', quantidade:62, minimo:5, preco:0, unidade:'un' },
    { nome:'REJUNTE FUTURA BRANCO', categoria:'FILIAL', quantidade:82, minimo:5, preco:0, unidade:'un' },
  ]);
  console.log('Banco populado com 122 produtos.');
}

// ── Rotas API ─────────────────────────────────────────────────────────────────

// GET /api/produtos
app.get('/api/produtos', (req, res) => {
  const produtos = db.prepare('SELECT * FROM produtos ORDER BY nome').all();
  res.json(produtos);
});

// POST /api/produtos
app.post('/api/produtos', (req, res) => {
  const { nome, categoria, quantidade, minimo, preco, unidade } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatorio' });
  const stmt = db.prepare(`
    INSERT INTO produtos (nome, categoria, quantidade, minimo, preco, unidade)
    VALUES (@nome, @categoria, @quantidade, @minimo, @preco, @unidade)
  `);
  const result = stmt.run({ nome, categoria: categoria||'FILIAL', quantidade: quantidade||0, minimo: minimo||0, preco: preco||0, unidade: unidade||'un' });
  const novo = db.prepare('SELECT * FROM produtos WHERE id = ?').get(result.lastInsertRowid);
  res.json(novo);
});

// PUT /api/produtos/:id
app.put('/api/produtos/:id', (req, res) => {
  const { nome, categoria, quantidade, minimo, preco, unidade } = req.body;
  db.prepare(`
    UPDATE produtos SET nome=@nome, categoria=@categoria, quantidade=@quantidade,
    minimo=@minimo, preco=@preco, unidade=@unidade WHERE id=@id
  `).run({ id: req.params.id, nome, categoria, quantidade, minimo, preco, unidade });
  res.json({ ok: true });
});

// DELETE /api/produtos/:id
app.delete('/api/produtos/:id', (req, res) => {
  db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// POST /api/movimentos  (entrada ou saida)
app.post('/api/movimentos', (req, res) => {
  const { prod_id, tipo, delta, vendedor } = req.body;
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(prod_id);
  if (!produto) return res.status(404).json({ error: 'Produto nao encontrado' });

  const novaQty = Math.max(0, produto.quantidade + delta);
  const prod_nome = produto.nome;

  db.transaction(() => {
    db.prepare('UPDATE produtos SET quantidade = ? WHERE id = ?').run(novaQty, prod_id);
    db.prepare(`
      INSERT INTO movimentos (prod_id, prod_nome, tipo, delta, vendedor)
      VALUES (@prod_id, @prod_nome, @tipo, @delta, @vendedor)
    `).run({ prod_id, prod_nome, tipo, delta, vendedor: vendedor || null });
  })();

  res.json({ ok: true, novaQty });
});

// GET /api/movimentos
app.get('/api/movimentos', (req, res) => {
  const limit = parseInt(req.query.limit) || 200;
  const movs = db.prepare(`
    SELECT * FROM movimentos ORDER BY id DESC LIMIT ?
  `).all(limit);
  res.json(movs);
});

// GET /api/stats  (para graficos)
app.get('/api/stats', (req, res) => {
  const totalProdutos = db.prepare('SELECT COUNT(*) as c FROM produtos').get().c;
  const estoquesBaixos = db.prepare('SELECT COUNT(*) as c FROM produtos WHERE quantidade <= minimo').get().c;
  const emDia = totalProdutos - estoquesBaixos;

  // Movimentos dos ultimos 7 dias agrupados por dia
  const movPorDia = db.prepare(`
    SELECT
      DATE(criado_em) as dia,
      SUM(CASE WHEN tipo='add' THEN delta ELSE 0 END) as entradas,
      SUM(CASE WHEN tipo='sub' THEN ABS(delta) ELSE 0 END) as saidas
    FROM movimentos
    WHERE criado_em >= DATE('now', '-7 days')
    GROUP BY DATE(criado_em)
    ORDER BY dia ASC
  `).all();

  // Top 5 vendedores por saidas
  const topVendedores = db.prepare(`
    SELECT vendedor, COUNT(*) as total, SUM(ABS(delta)) as pecas
    FROM movimentos
    WHERE tipo='sub' AND vendedor IS NOT NULL AND vendedor != ''
    GROUP BY vendedor
    ORDER BY pecas DESC
    LIMIT 5
  `).all();

  // Produtos mais movimentados
  const topProdutos = db.prepare(`
    SELECT prod_nome, SUM(ABS(delta)) as total
    FROM movimentos
    WHERE tipo='sub'
    GROUP BY prod_id
    ORDER BY total DESC
    LIMIT 5
  `).all();

  res.json({ totalProdutos, estoquesBaixos, emDia, movPorDia, topVendedores, topProdutos });
});

// Fallback para o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
