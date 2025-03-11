import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// ✅ Import All Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import BettingPage from "./pages/BettingPage";
import ProfilePage from "./pages/ProfilePage";
import BetsPage from "./pages/BetsPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import CreditRequestsPage from "./pages/CreditsRequestsPage";

// ✅ Import Protected Route Handling
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import './index.css'

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <AuthProvider>
      <Router>
      <div className="app-container">
        <Header />
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/home" />} />

          {/* ✅ User Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/match/:matchId" element={<MatchDetailsPage />} />
            <Route path="/betting/:matchId" element={<BettingPage />} />
            <Route path="/bets" element={<BetsPage />} />
          </Route>

          {/* ✅ Admin Routes */}
        {isAuthenticated && user?.role === "admin" && (
            <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/credit-requests" element={<CreditRequestsPage />} />
            </>
        )}

        </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
