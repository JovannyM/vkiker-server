export interface UserShortDTO {
  user: {
    id: string;
    name: string;
  };
  elo: number;
  battles: number;
  wins: number;
}
