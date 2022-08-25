import { useContext, useEffect } from "react";
import { useDrop } from "react-dnd";

import Grid2 from "@mui/material/Unstable_Grid2";

import { PART_1, SHIP, TILE } from "constants/const";
import waterImg from "components/../../public/water.jpg";
import { GameContext } from "GameBoard/context/GameBoardContext";
import Ship from "ShipDocks/Ship";
import { TileType } from "GameBoard/types";
import { getShipPartByIdx } from "utils";

const Tile = ({ tile }: { tile: TileType }) => {
  const idx = tile.idx;
  const { updateTilesBorders, placeShipOnBoard, checkCanDrop } =
    useContext(GameContext);
  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: SHIP,
      drop: (item: any) => {
        placeShipOnBoard({
          ...item,
          coordinates: {
            x: tile.x,
            y: tile.y,
          },
        });
      },
      hover: (item: any, monitor) => {
        updateTilesBorders({
          ship: {
            ...item,
            coordinates: {
              x: tile.x,
              y: tile.y,
            },
          },
          hovered: true,
          canDrop: monitor.canDrop(),
        });
      },
      canDrop: (item: any, monitor) => {
        if (item) {
          return checkCanDrop({
            ...item,
            coordinates: {
              x: tile.x,
              y: tile.y,
            },
          });
        } else {
          console.error("no item");
          return false;
        }
      },
      collect: (monitor) => ({
        item: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [placeShipOnBoard, updateTilesBorders, checkCanDrop]
  );

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
        ship: {
          ...(item as any),
          coordinates: {
            x: tile.x,
            y: tile.y,
          },
        },
        canDrop: false,
        hovered: isOver,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, item]);

  let tileOccupied = {};
  if (tile.occupiedBy)
    tileOccupied = {
      position: "absolute",
      top: 0,
      left: 0,
    };

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
        border: tile.border,
        background: `url(${waterImg})`,
        backgroundSize: "contain",
        overflow: "visible",
        position: "relative",
      }}
    >
      <div style={{ ...tileOccupied }}>
        {tile.occupiedBy &&
          tile.occupiedBy.dragPart ===
            getShipPartByIdx(tile.occupiedBy.size - 1) && (
            <Ship ship={tile.occupiedBy} />
          )}
      </div>
    </Grid2>
  );
};

export default Tile;
