import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'        
import ComingSoon from './components/ComingSoon.jsx' // ✅ usa esta página
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './breakpoints.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
