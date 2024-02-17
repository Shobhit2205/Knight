import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        loggedIn: false,
        user: null,
        token: "",
    })

    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if(data){
            const parserData = JSON.parse(data);
            setAuth({
                ...auth,
                loggedIn: true,
                user: parserData.user,
                token: parserData.token
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {props.children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {useAuth, AuthProvider}