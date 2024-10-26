
export default interface HeroType {
  id: number;
  name: string;
  gender: string;
  height: string;
  mass: string;
  eye_color: string;
  hair_color: string;
  skin_color: string;

  homeworld: number;
  url: string;
  films: number[];
  starships: number[];
  species: number[];
  vehicles: number[];
}