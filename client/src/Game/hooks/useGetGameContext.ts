import { MultiPlayerContext } from "MultiPlayer/context/MultiPlayerContext";
import { useContext } from "react";
import { SinglePlayerContext } from "SinglePlayer/context/SinglePlayerContext";

const useGetGameContext = () => {
  const singlePlayerContext = useContext(SinglePlayerContext);
  const multiPlayerContext = useContext(MultiPlayerContext);
  return singlePlayerContext ? singlePlayerContext : multiPlayerContext;
};

export default useGetGameContext;
