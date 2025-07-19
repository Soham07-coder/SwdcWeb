import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="653938123906-1qpf6dbs0u51auibm3lrmu3sg7a0gamh.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>

  </StrictMode>,
)
