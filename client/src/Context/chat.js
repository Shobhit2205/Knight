import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = (props) => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <ChatContext.Provider value={[selectedChat, setSelectedChat]}>
            {props.children}
        </ChatContext.Provider>
    )
}

const useChat = () => useContext(ChatContext);

export {useChat, ChatProvider}