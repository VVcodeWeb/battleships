import Grid2 from "@mui/material/Unstable_Grid2";
import backgroundMulti from "components/../../public/multi2.png";
import backgroundSingle from "components/../../public/background_2.jpg";

const Background = ({
  children,
  type,
}: {
  children: any;
  type: "single" | "multi";
}) => (
  <Grid2
    container
    direction="row"
    minHeight="100vh"
    justifyContent="center"
    alignItems="center"
    gap={1}
    style={{
      background: `url(${
        type === "multi" ? backgroundMulti : backgroundSingle
      })`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}
  >
    {children}
  </Grid2>
);

export default Background;
