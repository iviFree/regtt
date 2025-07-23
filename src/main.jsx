import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'         ❌ desactiva App temporalmente
import ComingSoon from './components/ComingSoon.jsx' // ✅ usa esta página
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ComingSoon />
  </React.StrictMode>
)
