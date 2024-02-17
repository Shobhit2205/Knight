import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

const MessagesProvider = (props) => {
    const [allMessages, setAllMessages] = useState([]);

    return (
        <MessagesContext.Provider value={[allMessages, setAllMessages]}>
            {props.children}
        </MessagesContext.Provider>
    )
}

const useMessages = () => useContext(MessagesContext);

export {useMessages, MessagesProvider}