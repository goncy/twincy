export interface Message {
  id: string;
  sender: {
    badges: string[];
    name: string;
  };
  timestamp: number;
  message: string;
  isHighlighted: boolean;
}
