import { Card, CardHeader, CardContent } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const LobbyCard = ({ header, children }: { header: string; children: any }) => (
  <Grid2 xs={4} height={150}>
    <Card elevation={3} style={{ height: "100%" }}>
      <CardHeader title={header} style={{ textAlign: "center" }} />
      <CardContent>{children}</CardContent>
    </Card>
  </Grid2>
);

export default LobbyCard;
