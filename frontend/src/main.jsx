import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey}>
          <App />
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)