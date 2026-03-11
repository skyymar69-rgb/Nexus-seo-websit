import React from 'react';

const NotificationContainer = ({ notifications }) => {
    return (
        <div className="notification-container">
            {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                        <p>{notification.message}</p>
                    </div>
                ))
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
};

export default NotificationContainer;