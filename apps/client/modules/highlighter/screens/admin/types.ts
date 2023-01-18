import type {EventMessage} from "~/types";

export interface Message extends EventMessage {
  isHighlighted: boolean;
}
