import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublishPage from "./pages/PublishPage";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import HomeUser from "./pages/HomeUser";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              <PrivateRoute requiredRole={["user", "admin"]}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/publish"
            element={
              <PrivateRoute requiredRole="admin">
                <PublishPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute requiredRole="admin">
                <p>Hello Admin good to see you</p>
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomeUser />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
