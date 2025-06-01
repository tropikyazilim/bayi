import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { neobrutalism } from '@clerk/themes'
import { trTR } from '@clerk/localizations'


const clerk_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerk_key) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerk_key}
      appearance={{
        baseTheme: neobrutalism
      }}
      localization={trTR}
      frontendApi="https://bayi.volkankok.dev/clerk"
      domain="bayi.volkankok.dev"
      proxyUrl="/clerk"
    >
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="bottom-right" richColors closeButton />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
)
