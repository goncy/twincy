export interface Review {
  id: string;
  sender: {
    badges: string[];
    name: string;
  };
  color: string;
  featured: boolean;
  timestamp: number;
  completed: boolean;
  selected: boolean;
  url: string;
}
