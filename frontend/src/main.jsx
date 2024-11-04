import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Display from './display.jsx'
import App from './App.jsx'
import Cashier from './cashier.jsx'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/*<App/>*/}
        <Cashier/>
        {/*<Display/>*/}
    </StrictMode>,
)