import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import io from 'socket.io-client';

const socketServerAddress = 'http://localhost:3000';
export const socket = io(socketServerAddress);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
          <App />
  </StrictMode>,
)
