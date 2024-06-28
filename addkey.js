/////////

const express = require('express');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allowedKeys = [];

// �?c danh s�ch allowed keys t? t?p van b?n khi kh?i d?ng ?ng d?ng
fs.readFile('allowedkeys.txt', 'utf8', (err, data) => {
  if (!err && data) {
    allowedKeys = data.split('\n').map(key => key.trim());
  }
});

// API d? th�m key m?i b?ng y�u c?u GET
app.get('/add-key', (req, res) => {
  const newKey = req.query.key;

  if (!newKey) {
    return res.status(400).send('Key is required.');
  }

  if (allowedKeys.includes(newKey)) {
    return res.status(400).send('Key already exists.');
  }

  allowedKeys.push(newKey);

  // Ghi danh s�ch allowed keys v�o t?p van b?n
  const allowedKeysData = allowedKeys.join('\n');
  fs.writeFile('allowedkeys.txt', allowedKeysData, 'utf8', (err) => {
    if (err) {
      console.error('Failed to write to allowedkeys.txt');
    }
  });

  return res.status(200).send(`Add Key Successfully! New key: ${newKey}`);
});

app.listen(port, () => {
  console.log(`API working on ${port} port`);
});
