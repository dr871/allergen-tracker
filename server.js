import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// CORS for local development only — in production, frontend is served from the same origin
if (process.env.NODE_ENV !== 'production') {
  const devOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(',');
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (devOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

// Load data from file
async function loadData() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    // File doesn't exist or invalid JSON
    return { frequencies: {}, logs: {}, foods: [] };
  }
}

// Save data to file
async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API endpoint: GET /api/data
app.get('/api/data', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Write mutex — prevents concurrent requests from racing on the same file
let writePromise = Promise.resolve();

// API endpoint: POST /api/data
app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    const { frequencies, logs, foods } = newData || {};
    if (
      !newData || typeof newData !== 'object' ||
      typeof frequencies !== 'object' || Array.isArray(frequencies) ||
      typeof logs !== 'object' || Array.isArray(logs) ||
      !Array.isArray(foods) ||
      Object.values(logs).some(v => !Array.isArray(v))
    ) {
      return res.status(400).json({ error: 'Invalid data shape' });
    }
    await (writePromise = writePromise.then(() => saveData(newData)));
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve React app for any other route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
