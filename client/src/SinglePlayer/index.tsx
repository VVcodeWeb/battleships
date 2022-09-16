import Background from "components/Background";
import Game from "Game";
import SinglePlayerProvider from "SinglePlayer/context/SinglePlayerContext";

const SinglePlayer = () => {
  return (
    <SinglePlayerProvider>
      <Background>
        <Game />
      </Background>
    </SinglePlayerProvider>
  );
};

export default SinglePlayer;
