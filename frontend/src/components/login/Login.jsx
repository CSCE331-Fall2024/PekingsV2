import { GoogleLogin } from 'react-google-login'
import {useAuth} from "./AuthProvider.jsx";

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID

function Login() {

    const onSuccess = (response) => {
        console.log("Login Success:", response.profileObj);
        // Send token to backend for verification
        fetch("/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.tokenId }),
        })
            .then((res) => res.json())
            .then((data) => console.log("Backend Response:", data));
    };

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res)
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default Login