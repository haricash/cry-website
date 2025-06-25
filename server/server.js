const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./cries.db');

db.serialize(() => {
  db.run(\`
    CREATE TABLE IF NOT EXISTS cries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_hash TEXT
    )
  \`);
});

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

app.post('/api/cry', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ipHash = hashIP(ip);

  db.get(\`SELECT timestamp FROM cries WHERE ip_hash = ? ORDER BY timestamp DESC LIMIT 1\`, [ipHash], (err, row) => {
    if (row && new Date(row.timestamp) > new Date(Date.now() - 30 * 60000)) {
      return res.status(429).send('Too many cries. Try again later.');
    }

    db.run(\`INSERT INTO cries (ip_hash) VALUES (?)\`, [ipHash], () => {
      res.sendStatus(200);
    });
  });
});

app.get('/api/stats', (req, res) => {
  db.all(\`
    SELECT DATE(timestamp) as date, COUNT(*) as count
    FROM cries
    WHERE timestamp >= datetime('now', '-14 days')
    GROUP BY DATE(timestamp)
  \`, [], (err, rows) => {
    const labels = [];
    const counts = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      labels.push(dateStr);
      const row = rows.find(r => r.date === dateStr);
      counts.push(row ? row.count : 0);
    }

    db.get(\`SELECT timestamp FROM cries ORDER BY timestamp DESC LIMIT 1\`, (err, row) => {
      res.json({
        lastCry: row?.timestamp || null,
        graphData: { labels, counts }
      });
    });
  });
});

setInterval(() => {
  db.run(\`UPDATE cries SET ip_hash = NULL WHERE timestamp < datetime('now', '-1 hour')\`);
}, 60 * 60 * 1000);

app.listen(port, () => {
  console.log(\`Server listening on port \${port}\`);
});