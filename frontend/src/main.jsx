import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Display from './Display.jsx'
import App from './App.jsx'
import Cashier from './Cashier.jsx'
import {Auth0Provider} from "@auth0/auth0-react";


createRoot(document.getElementById('root')).render(
    <Auth0Provider domain="dev-qqi54n0xtmhjjy7l.us.auth0.com"
                   clientId="uWUTlCiQNfLfSnG6Tjn52DjYp5Nu1ec2"
                   issuer="https://dev-qqi54n0xtmhjjy7l.us.auth0.com/"
                   authorizationParams={{
                       redirect_uri: window.location.origin,
                       audience: "https://auth.pekings.ceedric.dev",
                       scope: "openid profile email",
                   }
    }>

        <App />
        {/*<Cashier employee={{
        "id": 1,
        "username": "ThomasC",
        "pass": "CC137",
        "email": null,
        "position": "employee",
        "lastClockin": "00:00:00",
        "isClockedin": false,
        "pin": null
    }}/>*/}
        {/*<Display/>*/}

    </Auth0Provider>
)
