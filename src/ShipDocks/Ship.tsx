import { useEffect, useState } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import { useDrag } from "react-dnd";

import { ShipOrientation, ShipPartType, ShipType } from "ShipDocks/types";
import {
  VERTICAL,
  SHIP,
  HORIZONTAL,
  PATROL,
  DROMON,
  HEIGHT,
  WIDTH,
  MIN_MD_WIDTH,
  SMALLER_WIDTH,
  SMALLER_HEIGHT,
  NOT_ON_BOARD,
} from "constants/const";
import { getShipPartByIdx, getSize } from "utils";

const Ship = ({ ship }: { ship: ShipType }) => {
  const [icon, setIcon] = useState<string>("");
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const [shipPartInDrag, setShipPartInDrag] = useState<ShipPartType>(
    ship.part ?? null
  );
  const [shipOrientation, setShipOrientation] = useState<ShipOrientation>(
    ship.orientation ?? VERTICAL
  );

  const onRotateClick = () =>
    setShipOrientation((p) => (p === VERTICAL ? HORIZONTAL : VERTICAL));

  const [collected, drag, preview] = useDrag(
    {
      type: SHIP,
      item: {
        ...ship,
        part: shipPartInDrag,
        orientation: shipOrientation,
      },
      canDrag(monitor) {
        return ship.x === NOT_ON_BOARD;
      },
      collect: (monitor) => ({
        item: monitor.getItem(),
        didDrop: monitor.didDrop(),
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    },
    [shipOrientation, shipPartInDrag, ship]
  );

  //TODO: allow ships to be rotated on the board if it has enough space
  // Idea: make it rotatable by following clicked mouses
  const RotateIcon = () => {
    if (ship.x !== NOT_ON_BOARD || getSize(ship) < 2) return null;
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
        part = getShipPartByIdx(
          Math.floor(
            (bottom - clicked.y) / (isWiderMD ? HEIGHT : SMALLER_HEIGHT)
          )
        );
      else
        part = getShipPartByIdx(
          Math.floor((right - clicked.x) / (isWiderMD ? WIDTH : SMALLER_WIDTH))
        );
      setShipPartInDrag(part);
    } else throw new Error("Unknown drag object");
  };

  //Set new icon when orientation is changed
  useEffect(() => {
    const getIconPath = () => {
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
      return path.concat(iconPath);
    };
    setIcon(getIconPath());
  }, [ship.name, shipOrientation]);

  const getWholeSize = (size: number, isWiderMD: boolean) =>
    isWiderMD ? size * WIDTH : size * SMALLER_WIDTH;

  const size: React.CSSProperties = {
    width:
      shipOrientation === HORIZONTAL
        ? getWholeSize(getSize(ship), isWiderMD)
        : WIDTH,
    height:
      shipOrientation === VERTICAL
        ? getWholeSize(getSize(ship), isWiderMD)
        : HEIGHT,
  };

  const containerStyle: React.CSSProperties = {
    ...size,
    zIndex: 5,
    position: "relative",
    cursor: ship.x === NOT_ON_BOARD ? "grab" : "default",
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
      style={containerStyle}
    >
      <RotateIcon />
      <img
        style={size}
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
