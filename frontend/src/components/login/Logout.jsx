import { GoogleLogout } from 'react-google-login'

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID

function Logout() {

    const onSuccess = () => {
        console.log("LOGOUT SUCCESS!")
    }

    return (
        <div id="signOutButton">
            {/*<GoogleLogout*/}
            {/*    clientId={clientId}*/}
            {/*    buttonText="Logout"*/}
            {/*    onLogoutSuccess={onSuccess}*/}
            {/*/>*/}
        </div>
    )
}

export default Logout