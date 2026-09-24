import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx';
import { Toaster } from 'react-hot-toast';

document.documentElement.classList.add("dark");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
