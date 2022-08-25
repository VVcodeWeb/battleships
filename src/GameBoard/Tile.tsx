import Grid2 from "@mui/material/Unstable_Grid2";
import { ShipsTypes } from "components/types";
import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  NO_DROP_AND_VISIBLE,
  SHIP,
  TILE,
} from "constants/const";
import { useContext, useEffect } from "react";
import { useDrop } from "react-dnd";
import waterImg from "components/../../public/water.jpg";
import { GameContext } from "GameBoard/context/GameBoardContext";
import { time } from "console";
import { ShipDragData } from "GameBoard/types";

export type TileType = {
  idx: number;
  x: number;
  y: number;
  occupiedBy: ShipDragData | null;
  border:
    | typeof DEFAULT_BORDER
    | typeof CAN_DROP_AND_VISIBLE
    | typeof NO_DROP_AND_VISIBLE;
};

const Tile = ({ tile }: { tile: TileType }) => {
  const idx = tile.idx;
  const { checkCanDrop, updateTilesBorders, placeShipOnBoard } =
    useContext(GameContext);
  const [{ isOver, item }, drop] = useDrop(() => ({
    accept: SHIP,
    drop: (item: any) => {
      placeShipOnBoard({
        ...item,
        x: tile.x,
        y: tile.y,
      });
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item: any, monitor) => {
      updateTilesBorders({
        shipData: {
          ...item,
          x: tile.x,
          y: tile.y,
        },
        hovered: true,
        canDrop: monitor.canDrop(),
      });
    },
    canDrop: (item: any, monitor) => {
      if (item) {
        return checkCanDrop({
          x: tile.x,
          y: tile.y,
          ...item,
        });
      } else {
        console.error("no item");
        return false;
      }
    },
  }));

  useEffect(() => {
    const gameTiles = document.getElementsByClassName(
      TILE
    ) as HTMLCollectionOf<HTMLElement>;
    if (idx < 10 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_r_${idx}`);
    if (idx % 10 === 0 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_c_${idx}`);
  }, [idx]);
  useEffect(() => {
    if (!isOver)
      updateTilesBorders({
        shipData: {
          ...(item as any),
          x: tile.x,
          y: tile.y,
        },
        canDrop: false,
        hovered: isOver,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, item]);

  const getPartShipImage = (occupiedBy: ShipDragData) => {};
  return (
    <Grid2
      ref={drop}
      xs={1}
      className={TILE}
      style={{
        color: "white",
        textAlign: "center",
        height: 60,
        width: 60,
        boxSizing: "border-box",
        border: tile.border,
        background: `url(${waterImg})`,
        backgroundSize: "contain",
      }}
    >
      <div style={{ height: "100%", width: "100%" }}>
        {tile.occupiedBy && (
          <p style={{ color: isOver ? "red" : "white" }}>HELLo</p>
        )}
      </div>
    </Grid2>
  );
};

export default Tile;
