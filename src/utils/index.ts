import { ShipNames, ShipPart, ShipType } from "ShipDocks/types";
import {
  BATTLESHIP,
  CARAVELA,
  DROMON,
  DROMON_A,
  DROMON_B,
  FRIGATE,
  PART_0,
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  PATROL,
  PATROL_BOAT_A,
  PATROL_BOAT_B,
  VERTICAL,
} from "constants/const";

import patrolImg from "components/../../public/ships/patrol.png";
import dromon0Img from "components/../../public/ships/dromon_0.png";
import dromon1Img from "components/../../public/ships/dromon_1.png";

import caravela0Img from "components/../../public/ships/caravela_0.png";
import caravela1Img from "components/../../public/ships/caravela_1.png";
import caravela2Img from "components/../../public/ships/caravela_2.png";

import frigate0Img from "components/../../public/ships/frigate_0.png";
import frigate1Img from "components/../../public/ships/frigate_1.png";
import frigate2Img from "components/../../public/ships/frigate_2.png";
import frigate3Img from "components/../../public/ships/frigate_3.png";

import battleship0Img from "components/../../public/ships/battleship_0.png";
import battleship1Img from "components/../../public/ships/battleship_1.png";
import battleship2Img from "components/../../public/ships/battleship_2.png";
import battleship3Img from "components/../../public/ships/battleship_3.png";
import battleship4Img from "components/../../public/ships/battleship_4.png";

export const getAllships = (): ShipType[] => {
  const fleet: ShipType[] = [];
  const getSize = (name: ShipNames): number => {
    const n = name.toLowerCase();
    if (n === BATTLESHIP) return 5;
    if (n === FRIGATE) return 4;
    if (n === CARAVELA) return 3;
    if (n.includes("dromon")) return 2;
    return 1;
  };
  const buildShip = (name: ShipNames): ShipType => ({
    name,
    size: getSize(name),
    orientation: VERTICAL,
    dragPart: null,
    isOnBoard: false,
  });
  fleet.push(buildShip(BATTLESHIP));
  fleet.push(buildShip(FRIGATE));
  fleet.push(buildShip(CARAVELA));
  fleet.push(buildShip(DROMON_A));
  fleet.push(buildShip(DROMON_B));
  fleet.push(buildShip(PATROL_BOAT_A));
  fleet.push(buildShip(PATROL_BOAT_B));

  return fleet;
};
export const getShipPartByIdx = (idx: number): ShipPart => {
  switch (idx) {
    case 0:
      return PART_0;
    case 1:
      return PART_1;
    case 2:
      return PART_2;
    case 3:
      return PART_3;
    case 4:
      return PART_4;
    default:
      throw new Error("Invalid index getShipPartByIdx");
  }
};

export const getTilesBehindShipPart = (shipPart: ShipPart): number => {
  switch (shipPart) {
    case PART_0:
      return 0;
    case PART_1:
      return 1;
    case PART_2:
      return 2;
    case PART_3:
      return 3;
    case PART_4:
      return 4;
    default:
      throw new Error("Invalid ship part");
  }
};

export const getImage = (idx: number, name: ShipNames) => {
  const part = getShipPartByIdx(idx);
  if (name.includes(PATROL)) return patrolImg;
  if (name.includes(DROMON)) {
    if (part === PART_0) return dromon0Img;
    if (part === PART_1) return dromon1Img;
    throw new Error("Invalid dromon size");
  }
  if (name === CARAVELA) {
    if (part === PART_0) return caravela0Img;
    if (part === PART_1) return caravela1Img;
    if (part === PART_2) return caravela2Img;
    throw new Error("Invalid caravela size");
  }
  if (name === FRIGATE) {
    if (part === PART_0) return frigate0Img;
    if (part === PART_1) return frigate1Img;
    if (part === PART_2) return frigate2Img;
    if (part === PART_3) return frigate3Img;
    throw new Error("Invalid frigate size");
  }
  if (name === BATTLESHIP) {
    if (part === PART_0) return battleship0Img;
    if (part === PART_1) return battleship1Img;
    if (part === PART_2) return battleship2Img;
    if (part === PART_3) return battleship3Img;
    if (part === PART_4) return battleship4Img;
    throw new Error("Invalid battleship size");
  }
};
