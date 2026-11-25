import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { RoomTypes } from "./pages/RoomTypes";
import { Bookings } from "./pages/Bookings";
import { HotelInfo } from "./pages/HotelInfo";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/room-types" element={<RoomTypes />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/hotel-info" element={<HotelInfo />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
