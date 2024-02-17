import { createContext, useContext, useState } from "react";

const SnackContext = createContext();

const SnackProvider = (props) => {
    const [snack, setSnack] = useState({
        open: false,
        severity: null,
        message: null
    });

    return (
        <SnackContext.Provider value={[snack, setSnack]}>
            {props.children}
        </SnackContext.Provider>
    );
};

const useSnack = () => useContext(SnackContext);

export {useSnack, SnackProvider};
