import './App.css'
import { Suspense } from 'react';
import { useAuth } from './hooks/AuthHooks'
import { lazyLoad } from './utils';
const LoginPage = lazyLoad('/src/pages/LoginPage', null);

function App() {
  const { isAuthenticated, isPending } = useAuth();
  if(isPending) {
    return <h1>Loading......</h1>
  }
  return (
    <>
      {isAuthenticated ? <h1>Welcome to the Dashboard!</h1> : <Suspense><LoginPage/></Suspense> }
    </>
  )
}

export default App
