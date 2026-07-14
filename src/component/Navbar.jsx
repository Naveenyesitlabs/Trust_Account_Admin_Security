import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotifications, notificationReadStatusUpdate } from '../redux/slices/notificationSlice';
import NotificationModal from './NotificationModal';

// 🔹 Navbar Component
// - Props:
//   • showSidebar → boolean to control sidebar visibility
//   • setShowSidebar → function to toggle sidebar
const Navbar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();

  // 🔹 Redux state
  const { notification } = useSelector((state) => state.notification);

  // 🔹 Local component state
  const [onNotification, setOnNotification] = useState(false); // Toggle notifications ON/OFF
  const [allNotification, setAllNotification] = useState([]); // Stores fetched notifications
  const [openNotification, setOpenNotification] = useState(true); // Toggle notification dropdown
  const [notificationData, setNotificationData] = useState(false); // Stores single notification for modal
  const [openNotificationModal, setOpenNotificationModal] = useState(false); // Control modal visibility

  // 🔹 Fetch all notifications on component mount
  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  // 🔹 Update local notifications state when Redux state changes
  useEffect(() => {
    notification ? setAllNotification(notification) : '';
  }, [notification]);

  // 🔹 Helper function to format "time ago" and display time
  const handleDateAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeAgo = "";
    if (days > 0) {
      timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      timeAgo = "Just now";
    }

    // Format exact time using Intl API
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);

    return `${timeAgo} ${formattedTime}`;
  };

  // 🔹 Mark a notification as read and open modal
  const markAsReadFunction = async (notificationDetails) => {
    setNotificationData(notificationDetails);
    setOpenNotificationModal(true);

    // 🔹 Skip API call if already read
    if (notificationDetails?.is_read === '1') return;

    // 🔹 Dispatch API to mark as read
    await dispatch(notificationReadStatusUpdate({ notification_id: notificationDetails.id }));

    // 🔹 Refresh notification list
    dispatch(getAllNotifications());
  };

  return (
    <>
      <nav>
        {/* 🔹 Sidebar toggle */}
        <i className='bx bx-menu' onClick={() => setShowSidebar(!showSidebar)}>
          <i className="fas fa-bars"></i>
        </i>

        {/* 🔹 Notification Icon */}
        <div className="notification-in">
          <button type="button" onClick={() => setOpenNotification(!openNotification)}>
            <img src="images/menu-icons/notification.svg" alt="" />
          </button>

          {/* 🔹 Notification dropdown */}
          <div className="notification-list" style={{
            display: openNotification ? 'none' : 'block',
            opacity: openNotification ? 0 : 1,
            overflow: 'hidden',
            transition: 'all 1.5s ease-in-out'
          }}>
            {/* 🔹 Notification header with toggle switch */}
            <div className="notification-heading">
              <h1>Notifications</h1>
              <label className="switch">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  onClick={(e) => setOnNotification(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* 🔹 Notification list content */}
            {!onNotification ? (
              <div className="notification-list-inner">
                {allNotification?.length > 0 ? (
                  // 🔹 Map notifications
                  allNotification?.map((item, index) => (
                    <div
                      className="notification-list-item"
                      key={item?.id || index}
                      onClick={() => markAsReadFunction(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-list-item-text">
                        <p>{item?.title?.length > 15 ? item?.title?.slice(0, 15) + "..." : item?.title}</p>
                        <span>{handleDateAgo(item?.created_at)}</span>
                        {item?.is_read == '0' && (
                          <button type='submit' className='btn ' style={{ color: 'ButtonHighlight' }} >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // 🔹 No notifications
                  <div className="notification-list-item" style={{ padding: '1rem', minHeight: '60px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <div className="notification-list-item-text">
                      <p>There are no new notifications</p>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 🔹 Notifications turned off message
              <div className="notification-list-item" style={{ padding: '1rem', minHeight: '60px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                <div className="notification-list-item-text">
                  <p>Notifications are currently turned off.</p>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Admin user display */}
        <div className="admin-icon"> <img src="/images/admin.svg" alt="Admin" /> Admin </div>
      </nav>

      {/* 🔹 Notification modal for single notification */}
      {notificationData && (
        <NotificationModal
          show={openNotificationModal}
          handleClose={() => setOpenNotificationModal(false)}
          notification={notificationData}
        />
      )}
    </>
  );
};

export default Navbar;
