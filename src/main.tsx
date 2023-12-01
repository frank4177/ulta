import React from 'react'
import {render} from "react-dom"
import App from './App.tsx'

// ReactDOM.createRoot(document.getElementById('root')!).render(
  const root = document.getElementById('root')

  render(
    <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
  )
  
// )
