import { useContext } from "react";

import { Box } from "@mui/material";

import Grid2 from "@mui/material/Unstable_Grid2";

import Ship from "ShipDocks/Ship";
import { HEIGHT, WIDTH } from "constants/const";
import { BoardContext } from "Board/context/BoardContext";

const ShipDocks = () => {
  const { dockShips } = useContext(BoardContext);
  return (
    <Box
      className="ships_container"
      justifyContent="center"
      alignItems="top"
      display="flex"
      minHeight={dockShips.length > 0 ? 450 : 0}
      width={dockShips.length > 0 ? 400 : 0}
    >
      {dockShips.length > 0 && (
        <Grid2 container sx={{ width: "100%", margin: 0 }}>
          {dockShips.map((item) => (
            <Grid2
              style={{ width: item.size * WIDTH, height: item.size * HEIGHT }}
              key={`${item.name}_${item.dragPart}_imglist`}
            >
              <Ship ship={item} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default ShipDocks;
