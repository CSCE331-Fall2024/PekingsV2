import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Display from './Display.jsx'
import App from './App.jsx'
import Cashier from './Cashier.jsx'
import Kitchen from './Kitchen.jsx'

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
    <StrictMode>
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
    </StrictMode>,
)
