import Grid2 from "@mui/material/Unstable_Grid2";
import backgroundMulti from "components/../../public/multi2.png";

const Background = ({ children }: { children: any }) => (
  <Grid2
    container
    direction="row"
    minHeight="100vh"
    justifyContent="center"
    alignItems="center"
    gap={1}
    style={{
      background: `url(${backgroundMulti})`,
      backgroundSize: "100% 100%",
    }}
  >
    {children}
  </Grid2>
);

export default Background;
