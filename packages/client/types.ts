export interface EventMessage {
  id: string;
  color: string;
  channel: string;
  tags: {
    "msg-id": string;
    "custom-reward-id": string;
  };
  sender: {
    badges: string[];
    name: string;
  };
  timestamp: number;
  message: string;
}
