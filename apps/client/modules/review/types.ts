export interface Review {
  id: string;
  sender: {
    badges: string[];
    name: string;
  };
  color: string;
  timestamp: number;
  completed: boolean;
  selected: boolean;
  url: string;
}
