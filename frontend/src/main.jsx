import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import ClerkApiProvider from './components/ClerkApiProvider.jsx'
import { BrowserRouter } from 'react-router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey}>
          <ClerkApiProvider>
            <App />
          </ClerkApiProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>,
)
