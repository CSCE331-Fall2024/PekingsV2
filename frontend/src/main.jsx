import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Display from './Display.jsx'
import App from './App.jsx'
import Cashier from './Cashier.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/*<App />*/}
        <Cashier employee={{
            "id": 3,
            "username": "Germ",
            "pass": "Machamp",
            "email": null,
            "position": "employee",
            "lastClockin": "17:28:26.18",
            "isClockedin": false,
            "pin": null
        }}/>
        {/*<Display/>*/}
    </StrictMode>,
)
