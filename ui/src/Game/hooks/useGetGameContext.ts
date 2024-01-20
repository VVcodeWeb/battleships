import { MultiPlayerContext } from "MultiPlayer/context/MultiPlayerContext";
import { useContext, useMemo } from "react";
import { SinglePlayerContext } from "SinglePlayer/context/SinglePlayerContext";

const useGetGameContext = () => {
  const singlePlayerContext = useContext(SinglePlayerContext);
  const multiPlayerContext = useContext(MultiPlayerContext);
  const singlePlayer = useMemo(
    () => window.location.pathname.includes("single"),
    []
  );
  return singlePlayer ? singlePlayerContext : multiPlayerContext;
};

export default useGetGameContext;
