import { useState } from 'react';
import { useEffect } from 'react';
import phonebookService from './services/phonebook';
import ControlledTextInput from './components/ControlledTextInput';
import AddPersonForm from './components/AddPersonForm';
import PersonList from './components/PersonList.js';
import Notification from './components/Notification.js';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const hook = () => {
    phonebookService.getAll()
      .then(data => setPersons(data));
  }

  useEffect(hook, []);

  const addPerson = (event) => {

    event.preventDefault();

    if (checkBlankInput()) { return; }

    if (nameAlreadyInPhoneBook(newName)) {
      confirmPersonUpdate();
      return;
    }

    const newID = Math.max(persons.map(person => person.id)) + 1;
    const newPerson = { name: newName, number: newNumber, id: newID };

    phonebookService.create(newPerson)
      .then(data => setPersons(persons.concat(data)));

    setNewName('');
    setNewNumber('');
    updateNotification(`Added ${newName}`);
  }

  const updateNumber = (name) => {
    const index = persons.map(person => person.name).indexOf(name);
    const newPerson = { ...persons[index], number: newNumber }
    phonebookService.update(newPerson)
      .then(data => {
        setPersons(persons.map(p => p.id !== data.id ? p : data));
        updateNotification(`Updated the number of ${newPerson.name}`);
      })
      .catch(() => updateNotification(`${newPerson.name} has already been removed from the server.`));
  }

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure your want to delete ${person.name}?`)) {
      phonebookService.deletePerson(person);
      setPersons(persons.filter(p => p.id !== person.id));
      updateNotification(`Deleted ${person.name}`);
    }
  }

  const updateNameInput = (event) => {
    setNewName(event.target.value);
  }

  const updateNumberInput = (event) => {
    setNewNumber(event.target.value);
  }

  const updateFilterInput = (event) => {
    setFilter(event.target.value.toLowerCase());
  }

  const updateNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => { setNotificationMessage('') }, 5000);
  }

  const checkBlankInput = () => {
    if (!newName) {
      alert("Name cannot be blank");
      return true;
    }
    if (!newNumber) {
      alert("Number cannot be blank");
      return true;
    }
    return false;
  }

  const nameAlreadyInPhoneBook = (name) => {
    const index = persons.map(person => person.name).indexOf(name);
    if (index !== -1) {
      return true;
    }
    return false
  }

  const confirmPersonUpdate = () => {
    if (window.confirm(`${newName} is already in the phonebook, replace old number with new one?`)) {
      updateNumber(newName);
    }
  }

  const personsToDisplay =
    persons.filter(person => person.name.toLowerCase().indexOf(filter) !== -1);

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <ControlledTextInput onChange={updateFilterInput} value={filter} />
      <AddPersonForm
        addPerson={addPerson}
        onNameChange={updateNameInput}
        onNumberChange={updateNumberInput}
        name={newName}
        number={newNumber}
      />
      <PersonList persons={personsToDisplay} deletePerson={deletePerson} />
    </div>
  )
}

export default App