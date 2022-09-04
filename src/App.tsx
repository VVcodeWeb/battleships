import { MAIN, MULTI, SINGLE } from "constants/const";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";

import GameProvider from "SinglePlayer/context/GameContext";
import "./App.css";
import MainPage from "./MainPage";
import SinglePlayer from "./SinglePlayer";

function App() {
  type RouteNameType = keyof typeof routes;
  const location = useLocation();
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
