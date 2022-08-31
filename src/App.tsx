import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { animated, useTransition } from "react-spring";

import GameProvider from "SinglePlayer/context/GameContext";
import GameButton from "components/GameButton";
import "./App.css";
import MainPage from "./pages/MainPage";
import SinglePlayer from "./SinglePlayer";
const SINGLE = "single";
const MAIN = "main";
const MULTI = "multi";

function App() {
  type RouteNameType = keyof typeof routes;
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState<RouteNameType>(MAIN);
  const getTransformFrom = (page: RouteNameType) =>
    page === SINGLE ? "translate3d(0,100%, 0)" : "translate3d(0,-100%, 0)";

  const getTransformLeave = (page: RouteNameType) =>
    page === SINGLE ? "translate3d(0,-50%,0)" : "translate3d(0,50%,0)";
  const transitions = useTransition(page, {
    config: { duration: 500 },
    from: { opacity: 0, transform: getTransformFrom(page) },
    enter: { opacity: 1, transform: "translate3d(0%,0, 0)" },
    leave: { opacity: 0, transform: getTransformLeave(page) },
  });
  useEffect(() => {
    const newPage = location.pathname.replace(/\//g, "");
    if (newPage === SINGLE || newPage === MULTI) setPage(newPage);
    else setPage(MAIN);
  }, [location.pathname]);
  //TODO: 404 page
  const routes = {
    main: <Route path="/" element={<MainPage />} />,
    single: (
      <Route
        path="/single"
        element={
          <GameProvider>
            <SinglePlayer />
          </GameProvider>
        }
      />
    ),
    multi: <Route path="/multi" element={<>Not implemented</>} />,
  };
  return (
    <>
      {transitions((props, item) => (
        <animated.div style={props}>
          <Routes>{routes[item]}</Routes>
        </animated.div>
      ))}
    </>
  );
}
export default App;
