import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GeolocationModel } from '../models/geolocation.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}
  async getLocation(): Promise<GeolocationModel> {
    const position = await Geolocation.getCurrentPosition();
    let geolocation: GeolocationModel = {
      latitude: undefined,
      longitude: undefined,
      accuracy: undefined,
    };
    geolocation.latitude = position.coords.latitude;
    geolocation.longitude = position.coords.longitude;
    geolocation.accuracy = position.coords.accuracy;
    return geolocation;
  }
}
