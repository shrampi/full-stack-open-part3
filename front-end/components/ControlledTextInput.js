
const ControlledTextInput = (props) => {
    return (
      <div>
        {props.label}<input onChange={props.onChange} value={props.value} />
      </div>
    );
}

export default ControlledTextInput;