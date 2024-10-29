import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Cashier from './cashier.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Cashier />
  </StrictMode>,
)
