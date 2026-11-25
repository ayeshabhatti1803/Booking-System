import { Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Rooms } from "./pages/Rooms";
import { RoomDetail } from "./pages/RoomDetail";
import { Confirmation } from "./pages/Confirmation";
import { FindBooking } from "./pages/FindBooking";
import { ManageBooking } from "./pages/ManageBooking";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/confirmation/:code/:token" element={<Confirmation />} />
          <Route path="/find-booking" element={<FindBooking />} />
          <Route path="/manage-booking/:code/:token" element={<ManageBooking />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
