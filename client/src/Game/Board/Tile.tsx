import { useContext, useEffect, useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";

import Grid2 from "@mui/material/Unstable_Grid2";

import {
  COLUMNS,
  ENEMY_SHIP,
  FIGHTING,
  HORIZONTAL,
  ALLY,
  SHIP,
  TILE,
  VERTICAL,
} from "constants/const";
import waterImg from "components/../../public/water.jpg";
import Ship from "Game/ShipDocks/Ship";
import { TileType } from "Game/Board/types";
import { getShipPartByIdx, getSize } from "utils";
import { BoardContext } from "Game/Board/context/BoardContext";
import shellImg from "components/../../public/shell.png";
import fireImg from "components/../../public/fire2.png";
import blockImg from "components/../../public/block.png";
import useGetGameContext from "Game/hooks/useGetGameContext";
import useStyles from "hooks/useStyle";

const Tile = ({ tile, inDev }: { tile: TileType; inDev?: boolean }) => {
  const styles = useStyles();
  const { stage, currentPlayersTurn, makeMove } = useGetGameContext();
  const { updateTilesBorders, placeShipOnBoard, checkCanDrop } =
    useContext(BoardContext);
  const [canBeShelled, setCanBeShelled] = useState<boolean>(false);

  const handleDragDrop = (item: any) =>
    placeShipOnBoard({
      ...item,
      x: tile.x,
      y: tile.y,
    });

  const handleHover = (item: any, monitor: DropTargetMonitor<any, unknown>) =>
    updateTilesBorders({
      ship: {
        ...item,
        x: tile.x,
        y: tile.y,
      },
      hovered: true,
      canDrop: monitor.canDrop(),
    });

  const handleCanDrop = (item: any) => {
    if (!item || item.enemy) return false;
    if (item.enemy) return false;
    return checkCanDrop({
      ...item,
      x: tile.x,
      y: tile.y,
    });
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
    setTimeout(() => {
      if (tile.shelled || tile.blocked) return;
      if (tile.enemy && stage !== FIGHTING)
        throw new Error("Track board is visible during non fighting stage ");
      if (tile.enemy && currentPlayersTurn === ALLY)
        makeMove({ x: tile.x, y: tile.y, player: ALLY });
    }, 50);
  };

  useEffect(() => {
    setCanBeShelled(
      currentPlayersTurn === ALLY &&
        tile.enemy &&
        !tile.shelled &&
        !tile.blocked
    );
  }, [currentPlayersTurn, tile.blocked, tile.enemy, tile.shelled]);

  /*  x/y board numeration */
  useEffect(() => {
    const idx = tile.y * COLUMNS + tile.x;
    const tileClass = tile.enemy ? `${TILE}_enemy` : TILE;
    const gameTiles = document.getElementsByClassName(
      tileClass
    ) as HTMLCollectionOf<HTMLElement>;
    if (idx < 10 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_r_${idx}`);
    if (idx % 10 === 0 && gameTiles[idx])
      gameTiles[idx].classList.add(`item_c_${idx}`);
  }, [tile.enemy, tile.x, tile.y]);

  /* if not hovered anymore remove border styles */
  useEffect(() => {
    if (!tile.enemy && !isOver && item)
      updateTilesBorders({
        ship: {
          ...(item as any),
          x: tile.x,
          y: tile.y,
        },
        canDrop: false,
        hovered: isOver,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver, item]);

  const Icon = ({ src }: { src: string }) => {
    const imgStyle: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: styles.tilesWidth,
      height: styles.tilesHeight,
      zIndex: 6,
      pointerEvents: "none",
    };
    if (src === blockImg) {
      imgStyle.width = (imgStyle.width as number) - 5;
      imgStyle.height = (imgStyle.height as number) - 5;
    }
    return <img src={src} alt={src} style={imgStyle} />;
  };

  //TODO: add animations
  const RenderShell = () => {
    if (!tile.shelled && tile.blocked) return <Icon src={blockImg} />;
    if (!tile.shelled) return <></>;
    if (tile.occupiedBy === null) return <Icon src={shellImg} />;
    return <Icon src={fireImg} />;
  };

  const tileStyle: React.CSSProperties = {
    color: styles.textColorBoard,
    textAlign: "center",
    height: styles.tilesHeight,
    width: styles.tilesWidth,
    border: tile.border,
    background: `url(${waterImg})`,
    backgroundSize: "contain",
    overflow: "visible",
    position: "relative",
    textShadow: styles.textShadowBoard,
    cursor: canBeShelled ? "pointer" : "default",
  };
  //TODO: add proper type check for occupied by
  return (
    <Grid2
      onClick={onClick}
      ref={drop}
      xs={1}
      className={tile.enemy ? `${TILE}_enemy` : TILE}
      style={tileStyle}
    >
      <RenderShell />
      {inDev && <>DEV</>}
      {tile.occupiedBy &&
        tile.occupiedBy !== ENEMY_SHIP &&
        tile.occupiedBy.part ===
          getShipPartByIdx(getSize(tile.occupiedBy) - 1) && (
          <div
            style={{
              position: "absolute",
              top:
                tile.occupiedBy.orientation === HORIZONTAL
                  ? styles.distanceShipTile
                  : 0,
              left:
                tile.occupiedBy.orientation === VERTICAL
                  ? styles.distanceShipTile
                  : 0,
            }}
          >
            <Ship ship={tile.occupiedBy} />
          </div>
        )}
    </Grid2>
  );
};

export default Tile;
