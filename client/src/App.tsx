import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ClientDashboard from './pages/client/ClientDashboard'
import LawyerMarketplace from './pages/lawyer/LawyerMarketplace'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'
import { fetchCurrentUser } from './features/auth/authSlice'
import { useAppDispatch } from './store/hook'

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['lawyer']} />}>
            <Route path="/lawyer/marketplace" element={<LawyerMarketplace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
