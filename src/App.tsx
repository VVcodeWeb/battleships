import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import MainPage from "./components/MainPage";
import SinglePlayer from "./components/SinglePlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/single" element={<SinglePlayer />} />
        <Route path="/multi" element={<>Not implemented</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
