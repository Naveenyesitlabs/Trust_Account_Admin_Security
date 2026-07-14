import { useEffect } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getAllNotifications, notificationReadStatusUpdate } from '../redux/slices/notificationSlice';

// 🔹 Helper function to format "time ago" from a date
// - Returns a string like "5 minutes ago", "2 days ago", etc.
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,   // seconds in a year
        month: 2592000,   // seconds in a month
        week: 604800,     // seconds in a week
        day: 86400,       // seconds in a day
        hour: 3600,       // seconds in an hour
        minute: 60,       // seconds in a minute
        second: 1,
    };

    // 🔹 Loop through intervals to find largest matching time unit
    for (const key in intervals) {
        const value = Math.floor(seconds / intervals[key]);
        if (value > 0) return `${value} ${key}${value > 1 ? 's' : ''} ago`;
    }

    return 'just now';
};

// 🔹 NotificationModal component
// - Props:
//   • show → boolean to control modal visibility
//   • handleClose → function to close modal
//   • notification → object containing single notification data
const NotificationModal = ({ show, handleClose, notification }) => {
    const dispatch = useDispatch();

    // 🔹 useEffect to mark notification as read when modal opens
    useEffect(() => {
        if (!notification) return;

        // 🔹 If notification is already read, update read status in backend
        if (notification.is_read) {
            dispatch(notificationReadStatusUpdate({ notification_id: notification.id }));
            dispatch(getAllNotifications()); // Refresh notifications list after update
        }
    }, [notification]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {notification?.title}

                    {/* 🔹 Show "New" badge if notification is unread */}
                    {notification?.is_read && <Badge bg="primary" className="ms-2">New</Badge>}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* 🔹 Notification message */}
                <p>{notification?.message}</p>

                {/* 🔹 Display relative time ago */}
                <small className="text-muted">{timeAgo(notification?.created_at)}</small>
            </Modal.Body>

            <Modal.Footer>
                {/* 🔹 Close modal button */}
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;
