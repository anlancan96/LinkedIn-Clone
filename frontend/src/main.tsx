import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { store } from './store/store.tsx';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <App />
      </StrictMode>
    </QueryClientProvider>
  </Provider>,)
