export interface Geolocation {
  type: string;
  coordinates: number[];
}

export interface Comment {
  _id?: string;
  author: string;
  text: string;
  stars: number;
  createdAt: Date;
  geolocation?: Geolocation;
}

export interface Song {
  _id: string;
  name: string;
  artist: string;
  releaseDate?: Date;
  imageUrl?: string;
  comments: Comment[];
  geolocation?: Geolocation;
}
