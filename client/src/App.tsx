import { Route, Routes } from "react-router-dom";

import "./App.css";
import MultiPlayer from "MultiPlayer";
import Room from "MultiPlayer/Room";
import MainPage from "./MainPage";
import SinglePlayer from "./SinglePlayer";
import MultiPlayerProvider from "MultiPlayer/context/MultiPlayerContext";
import Wrapper from "MultiPlayer/Wrapper";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/single" element={<SinglePlayer />} />
        <Route path="multi" element={<MultiPlayer />} />
        <Route
          path="multi/:roomID"
          element={
            <MultiPlayerProvider>
              <Wrapper>
                <Room />
              </Wrapper>
            </MultiPlayerProvider>
          }
        />
      </Routes>
    </>
  );
}
export default App;
