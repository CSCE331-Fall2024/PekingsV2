import {createContext, useContext, useEffect, useState} from "react";
import {gapi} from "gapi-script";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authInstance, setAuthInstance] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const initClient = () => {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'profile email',
            }).then((auth) => {
                setAuthInstance(auth);
                setIsSignedIn(auth.isSignedIn.get());
                auth.isSignedIn.listen(setIsSignedIn);
            }).catch((error) => {
                console.error("Error initializing Google Auth", error);
            });
        });
    };

    useEffect(() => {
        initClient();
    }, []);

    return (
        <AuthContext.Provider value={{ authInstance, isSignedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);