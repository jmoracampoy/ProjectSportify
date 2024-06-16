// src/app/models/song.model.ts
export interface Comment {
  _id?:string;
  author: string;
  text: string;
  stars: number;
  createdAt: Date;
  geolocation?: {
    type: string;
    coordinates: number[];
  };
}

export interface Song {
  _id: string;
  name: string;
  artist: string;
  releaseDate?: Date;
  imageUrl?: string;
  comments: Comment[];
  geolocation?: {
    type: string;
    coordinates: number[];
  };
}
