import { Grid } from "@mui/material";
import {
  ShipNames,
  ShipOrientation,
  ShipPart,
  ShipType,
} from "ShipDocks/types";
import { VERTICAL, SHIP, PART_1, PART_0 } from "constants/const";
import { useState } from "react";
import { useDrag } from "react-dnd";
import { getImage, getShipPartByIdx } from "utils";

const Ship = ({
  ship,
  removeShipFromDock,
}: {
  ship: ShipType;
  removeShipFromDock?: (name: ShipNames) => void;
}) => {
  const imgStyle = {
    width: "60px",
    height: "60px",
  };
  const [shipPartInDrag, setShipPartInDrag] = useState<ShipPart>(null);
  const [shipOrientation, setShipOrientation] =
    useState<ShipOrientation>(VERTICAL);

  const [collected, drag, preview] = useDrag(
    {
      type: SHIP,
      item: {
        size: ship.size,
        name: ship.name,
        dragPart: shipPartInDrag,
        orientation: shipOrientation,
        isOnBoard: ship.isOnBoard,
      },
      end: (item, monitor) => {
        console.log({ item, didDrop: monitor.didDrop() });
        if (monitor.didDrop() && removeShipFromDock)
          removeShipFromDock(ship.name);
      },

      collect: (monitor) => ({
        item: monitor.getItem(),
        didDrop: monitor.didDrop(),
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    },
    [shipOrientation, shipPartInDrag, removeShipFromDock]
  );
  if (collected.isDragging) return <div ref={preview} />;

  return (
    <Grid
      ref={drag}
      direction="column"
      className="test"
      container
      style={{
        zIndex: 1000,
        width: 60,
        height: ship.size * 60,
        position: "relative",
      }}
    >
      {Array.from(Array(ship.size).keys())
        .map((key) => (
          <Grid
            key={`${ship.name}_${ship.dragPart}_${key}_ship`}
            item
            style={imgStyle}
          >
            <img
              style={imgStyle}
              src={getImage(key, ship.name)}
              srcSet={getImage(key, ship.name)}
              onDragStart={(e) => setShipPartInDrag(getShipPartByIdx(key))}
              alt={`ship-part-${key}`}
            />
          </Grid>
        ))
        .reverse()}
    </Grid>
  );
};

export default Ship;
