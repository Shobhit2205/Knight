import { createContext, useContext, useState } from "react";

const FetchContext = createContext();

const FetchChatProvider = (props) => {
    const [fetchChat, setFetchChat] = useState(false);

    return (
        <FetchContext.Provider value={[fetchChat, setFetchChat]}>
            {props.children}
        </FetchContext.Provider>
    )
}

const useFetchChat = () => useContext(FetchContext);

export {useFetchChat, FetchChatProvider}