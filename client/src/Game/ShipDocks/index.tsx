import { useContext } from "react";

import { Box } from "@mui/material";

import Grid2 from "@mui/material/Unstable_Grid2";

import Ship from "Game/ShipDocks/Ship";
import { HEIGHT, WIDTH } from "constants/const";
import { BoardContext } from "Game/Board/context/BoardContext";
import { getSize } from "utils";

const ShipDocks = ({ hidden }: { hidden?: boolean }) => {
  const { dockShips } = useContext(BoardContext);
  if (hidden) return <></>;
  return (
    <Box
      className="ships_container"
      justifyContent="center"
      alignItems="top"
      display="flex"
      minHeight={400}
      width={400}
    >
      {dockShips.length > 0 && (
        <Grid2 container sx={{ width: "100%", margin: 0 }}>
          {dockShips.map((item) => (
            <Grid2
              style={{
                width: getSize(item) * WIDTH,
                height: getSize(item) * HEIGHT,
              }}
              key={`${item.name}_${item.part}_imglist`}
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
