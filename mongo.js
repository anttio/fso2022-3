const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fso_rand_user:${password}@cluster0.bqdf3.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
const personName = process.argv[3];
const personNumber = process.argv[4];

if (personName && personNumber) {
  // If name and number exists create new person
  const person = new Person({
    name: personName,
    number: personNumber,
  });
  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  // List all people
  Person.find({}).then((people) => {
    console.log('phonebook:');
    people.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}
