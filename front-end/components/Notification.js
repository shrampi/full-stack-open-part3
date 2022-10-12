import '../index.css';

const Notification = (props) => {
    if (props.message) {
        return (
            <div className="notification">{props.message}</div>
        );
    }
}


export default Notification;