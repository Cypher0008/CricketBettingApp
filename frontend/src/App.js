import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ User Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/match/:id" element={<MatchDetailsPage />} />
            <Route path="/betting/:matchId" element={<BettingPage />} />
            <Route path="/bets" element={<BetsPage />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/credit-requests" element={<CreditRequestsPage />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
