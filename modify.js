import fs from 'fs';

const filePath = './src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const newStorageCode = `// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "baby-allergen-tracker-v5";

// Load data: try server first, fallback to localStorage
async function loadData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Network response not ok');
    const data = await response.json();
    // Cache in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Failed to fetch from server, using localStorage', err);
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      return r ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  }
}

// Save data: store locally and sync to server in background
async function saveData(d) {
  // Save to localStorage immediately for UI responsiveness
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {}
  
  // Attempt to sync to server in background
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    });
  } catch (err) {
    console.warn('Failed to sync to server', err);
  }
}
`;

// Replace the old storage block (from // ─── Storage ─── to function initState)
const storageStart = content.indexOf('// ─── Storage ──────────────────────────────────────────────────────────────────');
const initStateStart = content.indexOf('function initState');
const before = content.substring(0, storageStart);
const after = content.substring(initStateStart);
const newContent = before + newStorageCode + '\\n\\n' + after;

fs.writeFileSync(filePath, newContent);
console.log('Updated storage functions.');
