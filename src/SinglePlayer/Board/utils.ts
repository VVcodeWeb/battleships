import {
  CAN_DROP_AND_VISIBLE,
  NO_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
} from "constants/const";
import { BorderType } from "SinglePlayer/Board/types";

export const getBorder = ({
  hovered,
  canDrop,
}: {
  hovered: boolean;
  canDrop: boolean;
}): BorderType => {
  if (canDrop && hovered) return CAN_DROP_AND_VISIBLE;
  if (!canDrop && hovered) return NO_DROP_AND_VISIBLE;
  return DEFAULT_BORDER;
};
