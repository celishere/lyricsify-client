import { MouseEvent } from "react";

export interface IModal {
  handleBackgroundClick?: (e: MouseEvent<HTMLDivElement>) => void;
  handleCloseModal?: () => void;
}
