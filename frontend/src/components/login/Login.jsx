import {useEffect, useState} from "react";

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID

function Login() {
    const handleLogin = () => {
        // Redirect to the backend's OAuth2 login endpoint
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <button onClick={handleLogin}>Login</button>
    );
}

export default Login