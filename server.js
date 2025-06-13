const express = require('express');
const app = express();
const PORT = 4000;

// In-memory flag store (IMEI -> flag value)
const flagStore = {};

// GET: Get flag status for a specific IMEI
// Example: http://localhost:3000/get-flag?gs=864710056662710$0
app.get('/get-flag', (req, res) => {
  const { gs } = req.query;
  if (!gs || !gs.includes('$')) {
    return res.status(400).json({ error: 'Missing or invalid gs format' });
  }

  const [imei] = gs.split('$');
  const status = flagStore[imei] ?? false;

  res.json({
    imei,
    status
  });
});

// GET: Set flag status for a specific IMEI
// Example: http://localhost:3000/set-flag?gs=864710056662710$1
app.get('/set-flag', (req, res) => {
  const { gs } = req.query;
  if (!gs || !gs.includes('$')) {
    return res.status(400).json({ error: 'Missing or invalid gs format' });
  }

  const [imei, statusValue] = gs.split('$');
  const status = statusValue === '1';

  flagStore[imei] = status;

  res.json({
    message: 'Flag status updated successfully',
    imei,
    newStatus: status
  });
});

// Default route to check if server is running
app.get('/', (req, res) => {
  res.send('API is running! Use /get-flag or /set-flag');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
