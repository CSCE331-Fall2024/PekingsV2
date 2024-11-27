import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import {Auth0Provider} from "@auth0/auth0-react";

/**
 * The main entry point for rendering the React application.
 * Uses React's StrictMode and renders the primary App component.
 *
 * @module Main
 * @requires react
 * @requires react-dom/client
 *
 * @example
 * // Renders the application to the DOM
 * createRoot(document.getElementById('root')).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>
 * )
 *
 * @remarks
 * - Utilizes React 18's createRoot for rendering
 * - Wrapped in StrictMode for additional development checks
 * - Currently configured to render primary App component
 */

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
        {/*<Kitchen />*/}
        {/*<Cashier employee={{*/}
        {/*    "id": 1,*/}
        {/*    "username": "ThomasC",*/}
        {/*    "pass": "CC137",*/}
        {/*    "email": null,*/}
        {/*    "position": "employee",*/}
        {/*    "lastClockin": "00:00:00",*/}
        {/*    "isClockedin": false,*/}
        {/*    "pin": null*/}
        {/*}}/>*/}
        {/*<Display/>*/}

    </Auth0Provider>
)
