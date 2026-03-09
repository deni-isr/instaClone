import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Lisätään huutomerkki varmistamaan, että root-elementti on olemassa.
// Tämä poistaa TypeScriptin ilmoittaman null-virheen.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)