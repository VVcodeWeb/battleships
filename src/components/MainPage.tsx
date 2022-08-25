import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const MainPageCard = ({ title, content, onClick }: any) => {
  const boxShadow = {
    boxShadow:
      "0 .25rem 2.75rem rgba(32,17,46,.2),0 1.125rem 2.25rem -1.125rem rgba(0,0,0,.24),0 1.875rem 3.75rem -.625rem rgba(0,0,0,.16)",
  };
  return (
    <Card
      elevation={3}
      variant="outlined"
      className="animated_card"
      onClick={onClick}
      style={{ maxWidth: 300, padding: "0 30px 30px 30px", ...boxShadow }}
    >
      <CardHeader title={title} />
      <CardContent>{content}</CardContent>
    </Card>
  );
};

const MainPage = () => {
  const nav = useNavigate();

  return (
    <Grid2
      container
      direction="row"
      justifyContent="space-around"
      spacing={{ md: 4, xs: 6 }}
      alignItems="center"
      style={{ width: "100%" }}
    >
      <Grid2 md={4} xs={12} onClick={() => nav("/multi")}>
        <MainPageCard title="Multiplayer" content="Play multiplayer" />
      </Grid2>
      <Grid2 md={4} xs={12} onClick={() => nav("/single")}>
        <MainPageCard title="Single player" content="Play vs AI" />
      </Grid2>
    </Grid2>
  );
};

export default MainPage;
