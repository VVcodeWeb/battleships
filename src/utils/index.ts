import { ShipsTypes } from "components/types";
import { CARRIER } from "constants/const";

export const getAllships = (): ShipsTypes[] => {
  const fleet: ShipsTypes[] = [];
  fleet.push({
    name: CARRIER,
    size: 2,
  });
  fleet.push({
    name: CARRIER,
    size: 2,
  });
  fleet.push({
    name: CARRIER,
    size: 2,
  });

  fleet.push({
    name: CARRIER,
    size: 2,
  });
  fleet.push({
    name: CARRIER,
    size: 2,
  });

  fleet.push({
    name: CARRIER,
    size: 2,
  });
  fleet.push({
    name: CARRIER,
    size: 2,
  });
  return fleet;
};
