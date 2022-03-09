export interface Review {
  id: string;
  type: "linkedin" | "portfolio";
  sender: {
    badges: string[];
    name: string;
  };
  icon: string;
  color: string;
  featured: boolean;
  timestamp: number;
  completed: boolean;
  selected: boolean;
  url: string;
}
