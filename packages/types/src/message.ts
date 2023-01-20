export interface Message {
  id: string;
  color: string;
  channel: string;
  tags: {
    "msg-id": string;
    "custom-reward-id": string;
    mod: boolean;
  };
  sender: {
    badges: string[];
    name: string;
  };
  timestamp: number;
  message: string;
  isHighlighted: boolean;
}
