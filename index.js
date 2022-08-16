const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Configure morgan to show POST data
morgan.token('postdata', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postdata'
  )
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date().toString()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons/', (req, res) => {
  const person = req.body;

  // If name or number is missing return 400
  if (!person.name || !person.number) {
    return res.status(400).json({ error: 'the name or number is missing' });
  }

  // If name already exists return 400
  if (persons.find((p) => p.name === person.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  person.id = Math.floor(Math.random() * 10000);
  persons = persons.concat(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
