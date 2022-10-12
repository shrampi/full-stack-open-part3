
import PersonInformation from "./PersonInformation";

const PersonList = ({ persons, deletePerson }) => {

    return (
        <div>
            <h2>Numbers</h2>
            {
                persons.map(person => {
                    return (
                        <PersonInformation
                            key={person.id}
                            person={person}
                            deletePerson={deletePerson}
                        />
                    );
                }
                )
            }
        </div>
    );
}

export default PersonList;