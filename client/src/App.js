import { Routes, Route } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";
import Homepage from "./screens/HomePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/" element={<Homepage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
