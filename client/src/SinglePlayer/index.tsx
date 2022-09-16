import Game from "Game";
import SinglePlayerProvider from "SinglePlayer/context/SinglePlayerContext";

const SinglePlayer = () => {
  return (
    <SinglePlayerProvider>
      <Game />
    </SinglePlayerProvider>
  );
};

export default SinglePlayer;
