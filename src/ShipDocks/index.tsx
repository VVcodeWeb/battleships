import { Box, ImageList, ImageListItem } from "@mui/material";
import { ShipNames, ShipType } from "ShipDocks/types";
import { useState, useEffect } from "react";
import Ship from "ShipDocks/Ship";
import { getAllships } from "utils";

const ShipDocks = () => {
  const [dockShips, setDockShips] = useState<Array<ShipType>>([]);
  const removeShipFromDock = (name: ShipNames) => {
    return setDockShips((prevState) =>
      prevState.filter((ship) => ship.name !== name)
    );
  };
  useEffect(() => {
    setDockShips(getAllships());
  }, []);

  return (
    <Box className="ships_container">
      <ImageList sx={{ width: "100%", height: "100%" }} cols={4} rowHeight={60}>
        {dockShips.map((item, idx) => (
          <ImageListItem key={`${item.name}_${item.dragPart}_imglist`}>
            <Ship ship={item} removeShipFromDock={removeShipFromDock} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ShipDocks;
