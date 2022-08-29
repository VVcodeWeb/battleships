import { useContext, useEffect, useState, useTransition } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";

import Grid2 from "@mui/material/Unstable_Grid2";

import {
  ENEMY_SHIP,
  FIGHTING,
  HEIGHT,
  HUMAN,
  NO_DROP_AND_VISIBLE,
  SHIP,
  SMALLER_HEIGHT,
  SMALLER_WIDTH,
  TILE,
  WIDTH,
} from "constants/const";
import waterImg from "components/../../public/water.jpg";
import Ship from "ShipDocks/Ship";
import { TileType } from "Board/types";
import { getShipPartByIdx } from "utils";
import { BoardContext } from "Board/context/BoardContext";
import { GameContext } from "SinglePlayer/context/GameContext";
import shellImg from "components/../../public/shell.png";
import lolImg from "components/../../public/lol.png";
import fireImg from "components/../../public/fire2.png";
import { animated, useSpring } from "react-spring";

const Tile = ({ tile, inDev }: { tile: TileType; inDev?: boolean }) => {
  const { gameStage, playersTurn, makeMove } = useContext(GameContext);
  const { updateTilesBorders, placeShipOnBoard, checkCanDrop } =
    useContext(BoardContext);
  const [canBeShelled, setCanBeShelled] = useState<boolean>(false);

  const handleDragDrop = (item: any) =>
    placeShipOnBoard({
      ...item,
      coordinates: {
        x: tile.x,
        y: tile.y,
      },
    });

  const handleHover = (item: any, monitor: DropTargetMonitor<any, unknown>) =>
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

  const handleCanDrop = (item: any) => {
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
  };

  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: SHIP,
      hover: handleHover,
      canDrop: handleCanDrop,
      drop: handleDragDrop,
      collect: (monitor) => ({
        item: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [placeShipOnBoard, updateTilesBorders, checkCanDrop]
  );
  const onClick = () => {
    if (tile.shelled) return;
    if (tile.enemy && gameStage !== FIGHTING)
      throw new Error("Track board is visible during non fighting stage ");
    if (tile.enemy && playersTurn === HUMAN) {
      makeMove({ x: tile.x, y: tile.y, player: HUMAN });
    }
  };

  let tileOccupied = {};
  if (tile.occupiedBy)
    tileOccupied = {
      position: "absolute",
      top: 0,
      left: 0,
    };

  useEffect(() => {
    setCanBeShelled(playersTurn === HUMAN && tile.enemy && !tile.shelled);
  }, [playersTurn, tile.enemy, tile.shelled]);

  /*  x/y board numeration */
  useEffect(() => {
    const idx = tile.idx;
    const tileClass = tile.enemy ? `${TILE}_enemy` : TILE;
    const gameTiles = document.getElementsByClassName(
      tileClass
    ) as HTMLCollectionOf<HTMLElement>;
    if (idx < 10 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_r_${idx}`);
    if (idx % 10 === 0 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_c_${idx}`);
  }, [tile.enemy, tile.idx]);

  /* if not hovered anymore remove border styles */
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

  const Icon = ({ src }: { src: string }) => {
    return (
      <img
        src={src}
        alt={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: tile.enemy ? SMALLER_WIDTH : WIDTH,
          height: tile.enemy ? SMALLER_HEIGHT : HEIGHT,
          zIndex: 6,
          pointerEvents: "none",
        }}
      />
    );
  };
  const RenderShell = () => {
    if (tile.shelled) {
      if (tile.occupiedBy === null) return <Icon src={shellImg} />;
      return <Icon src={fireImg} />;
    }

    return <></>;
  };

  return (
    <Grid2
      onClick={onClick}
      ref={drop}
      xs={1}
      className={tile.enemy ? `${TILE}_enemy` : TILE}
      style={{
        color: "white",
        textAlign: "center",
        height: tile.enemy ? SMALLER_HEIGHT : HEIGHT,
        width: tile.enemy ? SMALLER_WIDTH : WIDTH,
        border: inDev ? NO_DROP_AND_VISIBLE : tile.border,
        background: `url(${waterImg})`,
        backgroundSize: "contain",
        overflow: "visible",
        position: "relative",
        cursor: canBeShelled ? "pointer" : "default",
      }}
    >
      <RenderShell />
      <div style={{ ...tileOccupied }}>
        {tile.occupiedBy !== null &&
          tile.occupiedBy !== ENEMY_SHIP &&
          tile.occupiedBy.dragPart ===
            getShipPartByIdx(tile.occupiedBy.size - 1) && (
            <Ship ship={tile.occupiedBy} />
          )}
      </div>
    </Grid2>
  );
};

export default Tile;
