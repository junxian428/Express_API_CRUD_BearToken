const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
app.use(bodyParser.json());

// define middleware to verify bearer token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  const expectedToken = 'mytoken123';
  if (token !== `Bearer ${expectedToken}`) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// define CRUD routes
let nextId = 1;
const items = [];

app.get('/items', verifyToken, (req, res) => {
  res.json(items);
});

app.get('/items/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).send('Not found');
  }
  res.json(item);
});

app.post('/items', verifyToken, (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).send('Name is required');
  }
  const item = { id: nextId++, name };
  items.push(item);
  res.status(201).json(item);
});

app.put('/items/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send('Not found');
  }
  if (!name) {
    return res.status(400).send('Name is required');
  }
  items[itemIndex].name = name;
  res.json(items[itemIndex]);
});

app.delete('/items/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send('Not found');
  }
  const deletedItem = items.splice(itemIndex, 1)[0];
  res.json(deletedItem);
});

// start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
