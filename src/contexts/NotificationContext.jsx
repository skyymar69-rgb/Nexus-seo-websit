import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message) => {
        setNotifications((prev) => [...prev, { message, id: Date.now() }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((note) => note.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((note) => (
                    <div key={note.id} className="notification">
                        {note.message}
                        <button onClick={() => removeNotification(note.id)}>X</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);