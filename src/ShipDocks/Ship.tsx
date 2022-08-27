import { useCallback, useEffect, useState } from "react";
import { Grid, Opacity } from "@mui/material";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import { useDrag } from "react-dnd";

import {
  ShipNames,
  ShipOrientation,
  ShipPartType,
  ShipType,
} from "ShipDocks/types";
import {
  VERTICAL,
  SHIP,
  HORIZONTAL,
  PATROL,
  DROMON,
  HEIGHT,
  WIDTH,
} from "constants/const";
import { getShipPartByIdx } from "utils";
import fireIcon from "components/../../public/fire.png";
const imgStyle = {
  width: "60px",
  height: "60px",
};

const imgSmallStyle = {
  width: "40px",
  height: "40px",
};
/* <img
        style={{
          ...imgSmallStyle,
          position: "absolute",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          marginLeft: "auto",
          pointerEvents: "none",
        }}
        src={fireIcon}
        srcSet={fireIcon}
        alt={`ship-part-fire-${idx}`}
      /> */

const Ship = ({
  ship,
  removeShipFromDock,
}: {
  ship: ShipType;
  removeShipFromDock?: (name: ShipNames) => void;
}) => {
  const [shipPartInDrag, setShipPartInDrag] = useState<ShipPartType>(
    ship.dragPart ?? null
  );
  const [shipOrientation, setShipOrientation] = useState<ShipOrientation>(
    ship.orientation ?? VERTICAL
  );
  const [icon, setIcon] = useState<string>("");
  //Set new icon when orientation is changed
  useEffect(() => {
    const name = ship.name.includes(PATROL)
      ? PATROL
      : ship.name.includes(DROMON)
      ? DROMON
      : ship.name;
    const path = `/ships/`;
    let iconPath = "";
    iconPath = iconPath.concat(name);

    if (shipOrientation === HORIZONTAL)
      iconPath = iconPath.concat("_horizontal");
    iconPath = iconPath.concat(".png");
    setIcon(path.concat(iconPath));
  }, [ship.name, shipOrientation]);

  const onRotateClick = () =>
    setShipOrientation((p) => (p === VERTICAL ? HORIZONTAL : VERTICAL));
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

  //: allow ships to be rotated on the board if it has enough space
  // Idea: make it rotatable by following clicked mouses
  const RotateIcon = () => {
    if (ship.isOnBoard || ship.size < 2) return null;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
          color: "white",
        }}
      >
        <Rotate90DegreesCwIcon
          onClick={onRotateClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };

  const onDragStart = (e: any) => {
    const clicked = {
      x: e.clientX,
      y: e.clientY,
    };
    const grabImgDiv = document.getElementById(e.target.id);
    if (grabImgDiv) {
      const { right, bottom } = grabImgDiv.getBoundingClientRect();
      let part;
      if (shipOrientation === VERTICAL)
        part = getShipPartByIdx(Math.floor((bottom - clicked.y) / HEIGHT));
      else part = getShipPartByIdx(Math.floor((right - clicked.x) / WIDTH));
      setShipPartInDrag(part);
    } else throw new Error("Unknown drag object");
  };
  if (collected.isDragging) return <div ref={preview} />;
  return (
    <Grid
      ref={drag}
      direction={
        shipOrientation === VERTICAL && !icon.includes(HORIZONTAL)
          ? "column"
          : "row"
      }
      container
      style={{
        zIndex: 1000,
        width: shipOrientation === HORIZONTAL ? ship.size * WIDTH : WIDTH,
        height: shipOrientation === VERTICAL ? ship.size * HEIGHT : HEIGHT,
        position: "relative",
      }}
    >
      <RotateIcon />
      <img
        style={{
          width: shipOrientation === HORIZONTAL ? ship.size * WIDTH : WIDTH,
          height: shipOrientation === VERTICAL ? ship.size * HEIGHT : HEIGHT,
        }}
        src={icon}
        srcSet={icon}
        onDragStart={onDragStart}
        alt={ship.name}
        id={ship.name}
      />
    </Grid>
  );
};

export default Ship;
