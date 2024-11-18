import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Display from './Display.jsx'
import App from './App.jsx'
import Cashier from './Cashier.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/*<App />*/}
        <Kitchen />
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
