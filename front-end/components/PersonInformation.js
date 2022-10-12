
const PersonInformation = ({ person, deletePerson }) => {
    const deleteSpecificPerson = () => {deletePerson(person)};
    return (
        <div>
            {person.name} {person.number}
            <button onClick={deleteSpecificPerson}>delete</button>
        </div>
    );

}

export default PersonInformation;