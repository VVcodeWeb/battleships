import { Route, Routes } from "react-router-dom";

import "./App.css";
import MultiPlayer from "MultiPlayer";
import Room from "MultiPlayer/Room";
import MainPage from "./MainPage";
import SinglePlayer from "./SinglePlayer";
import MultiPlayerProvider from "MultiPlayer/context/MultiPlayerContext";
import UserProvider from "MultiPlayer/context/UserContext";
import SocketProvider from "MultiPlayer/context/SocketContext";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/single" element={<SinglePlayer />} />
        <Route
          path="multi"
          element={
            <UserProvider>
              <MultiPlayer />
            </UserProvider>
          }
        />
        <Route
          path="multi/:roomID"
          element={
            <UserProvider>
              <SocketProvider>
                <MultiPlayerProvider>
                  <Room />
                </MultiPlayerProvider>
              </SocketProvider>
            </UserProvider>
          }
        />
      </Routes>
    </>
  );
}
export default App;
