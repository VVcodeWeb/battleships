import { useState, useEffect, useContext } from "react";

import { Button, Box, ImageList, ImageListItem } from "@mui/material";

import { ShipNames, ShipType } from "ShipDocks/types";
import Ship from "ShipDocks/Ship";
import { getAllships } from "utils";
import { GameContext } from "SinglePlayer/context/useGameContext";
import { HEIGHT, READY, WIDTH } from "constants/const";

const ShipDocks = () => {
  const [dockShips, setDockShips] = useState<Array<ShipType>>(getAllships());
  const [displayReadyButton, setDisplayReadyButton] = useState<boolean>(false);
  const { setGameStage } = useContext(GameContext);

  useEffect(
    () => setDisplayReadyButton(dockShips.length === 0),
    [dockShips, setGameStage]
  );

  const removeShipFromDock = (name: ShipNames) => {
    return setDockShips((prevState) =>
      prevState.filter((ship) => ship.name !== name)
    );
  };
  const onReadyClick = () => setGameStage(READY);

  return (
    <Box className="ships_container" style={{ height: "100%" }}>
      {displayReadyButton && (
        <Box
          height="100%"
          justifyContent="center"
          display="flex"
          alignItems="center"
        >
          <Button variant="contained" onClick={onReadyClick}>
            Ready
          </Button>
        </Box>
      )}
      {dockShips.length > 0 && (
        <ImageList sx={{ width: "100%", margin: 0 }}>
          {dockShips.map((item, idx) => (
            <ImageListItem
              style={{ width: item.size * WIDTH, height: item.size * HEIGHT }}
              key={`${item.name}_${item.dragPart}_imglist`}
            >
              <Ship ship={item} removeShipFromDock={removeShipFromDock} />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default ShipDocks;
