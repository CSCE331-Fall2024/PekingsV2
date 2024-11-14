import Logout from "./Logout.jsx";
import Login from "./Login.jsx";
import {useAuth} from "./AuthProvider.jsx";

function GoogleAuth() {
    const { isSignedIn } = useAuth();

    return (
        <div>
            {isSignedIn ? <Logout></Logout> : <Login></Login>}
        </div>
    );
}

export default GoogleAuth