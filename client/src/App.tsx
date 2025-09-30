import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ClientDashboard from './pages/client/ClientDashboard'
import LawyerMarketplace from './pages/lawyer/LawyerMarketplace'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Client routes */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        
        {/* Lawyer routes */}
        <Route path="/lawyer/marketplace" element={<LawyerMarketplace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
