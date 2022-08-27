import { Button } from "@mui/material";

const GameButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: (e?: any) => void;
}) => {
  return (
    <Button variant="contained" onClick={onClick}>
      {text}
    </Button>
  );
};

export default GameButton;
