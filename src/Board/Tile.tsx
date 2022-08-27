import { useContext, useEffect } from "react";
import { useDrop } from "react-dnd";

import Grid2 from "@mui/material/Unstable_Grid2";

import {
  ENEMY_SHIP,
  FIGHTING,
  HEIGHT,
  HUMAN,
  NO_DROP_AND_VISIBLE,
  SHIP,
  TILE,
  WIDTH,
} from "constants/const";
import waterImg from "components/../../public/water.jpg";
import Ship from "ShipDocks/Ship";
import { TileType } from "Board/types";
import { getShipPartByIdx } from "utils";
import { BoardContext } from "Board/context/BoardContext";
import { GameContext } from "SinglePlayer/context/useGameContext";

const Tile = ({ tile, inDev }: { tile: TileType; inDev?: boolean }) => {
  const idx = tile.idx;
  const { gameStage, playersTurn, makeMove } = useContext(GameContext);
  const { updateTilesBorders, placeShipOnBoard, checkCanDrop } =
    useContext(BoardContext);
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
        if (item.enemy) return false;
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
    if (!tile.enemy && !isOver)
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

  const onClick = () => {
    if (gameStage !== FIGHTING)
      throw new Error("Track board is visible during non fighting stage ");
    if (tile.enemy && playersTurn === HUMAN) {
      makeMove({ x: tile.x, y: tile.y, player: HUMAN });
    }
  };
  return (
    <Grid2
      onClick={onClick}
      ref={drop}
      xs={1}
      className={TILE}
      style={{
        color: "white",
        textAlign: "center",
        height: HEIGHT,
        width: WIDTH,
        border: inDev ? NO_DROP_AND_VISIBLE : tile.border,
        background: `url(${waterImg})`,
        backgroundSize: "contain",
        overflow: "visible",
        position: "relative",
      }}
    >
      {tile.shelled && <span>SHELLED</span>}
      <div style={{ ...tileOccupied }}>
        {tile.occupiedBy &&
          tile.occupiedBy !== ENEMY_SHIP &&
          tile.occupiedBy?.dragPart ===
            getShipPartByIdx(tile.occupiedBy.size - 1) && (
            <Ship ship={tile.occupiedBy} />
          )}

        {tile.occupiedBy === ENEMY_SHIP && <span>ENEMY</span>}
      </div>
    </Grid2>
  );
};

export default Tile;
