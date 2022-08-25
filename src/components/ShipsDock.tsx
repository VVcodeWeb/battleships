import { Box, Grid, ImageList, ImageListItem } from "@mui/material";

import battleshipP1Img from "components/../../public/battleship_p_1.jpg";
import battleshipP2Img from "components/../../public/battleship_p_2.jpg";
import { ShipsTypes } from "components/types";
import { PART_0, PART_1, SHIP, VERTICAL } from "constants/const";
import { ShipOrientation, ShipPart } from "GameBoard/types";
import { useState } from "react";
import { useDrag } from "react-dnd";
interface DropResult {
  name: string;
}

const Ship = ({ ship }: { ship: ShipsTypes }) => {
  const imgStyle = {
    width: "60px",
    height: "60px",
  };
  const [shipPartInDrag, setShipPartInDrag] = useState<ShipPart>(null);
  const [shipOrientation, setShipOrientation] =
    useState<ShipOrientation>(VERTICAL);
  const [collected, drag, preview] = useDrag({
    type: SHIP,
    item: {
      size: ship.size,
      name: ship.name,
      shipPart: shipPartInDrag,
      shipOrientation: shipOrientation,
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  });
  if (collected.isDragging) return <div ref={preview} />;

  return (
    <Grid
      ref={drag}
      direction="column"
      className="test"
      container
      style={{ zIndex: 5, width: 60, height: 120 }}
    >
      <Grid item xs={6} style={imgStyle}>
        <img
          style={imgStyle}
          src={`${battleshipP1Img}`}
          srcSet={`${battleshipP1Img}`}
          onDragStart={(e) => setShipPartInDrag(PART_1)}
          alt="ship"
        />
      </Grid>
      <Grid item xs={6} style={imgStyle}>
        <img
          style={imgStyle}
          src={`${battleshipP2Img}`}
          onDragStart={(e) => setShipPartInDrag(PART_0)}
          srcSet={`${battleshipP2Img}`}
          alt="ship"
        />
      </Grid>
    </Grid>
  );
};

const ShipsDock = ({ fleet }: { fleet: ShipsTypes[] }) => {
  return (
    <Box className="ships_container">
      <ImageList
        sx={{ width: "100%", height: "100%" }}
        rowHeight={150}
        cols={2}
      >
        {fleet.map((item, idx) => (
          <ImageListItem key={idx}>
            <Ship ship={item} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ShipsDock;
