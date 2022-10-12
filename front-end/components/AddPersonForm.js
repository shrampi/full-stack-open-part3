
import ControlledTextInput from "./ControlledTextInput";

const AddPersonForm = (props) => {
  return (
    <div>
      <h2>Add New Contact</h2>
      <form onSubmit={props.addPerson}>
        <ControlledTextInput
          label="name:"
          onChange={props.onNameChange}
          value={props.name}
        />
        <ControlledTextInput
          label="number:"
          onChange={props.onNumberChange}
          value={props.number}
        />
        <button type="submit">add</button>
      </form>
    </div>
  );
}

export default AddPersonForm;