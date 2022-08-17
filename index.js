require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

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

const Person = require('./models/person');
const { response } = require('express');

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date().toString()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => res.json(people));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons/', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'the name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => res.json(savedPerson));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
