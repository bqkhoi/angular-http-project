import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:8080/places', "Error occurs when loading available place.")
  }

  fetchPlaces(url:string, errorMessage:string){
    return this.httpClient.get<{ places:Place[] }>(url)
      .pipe(
        map(resData=>resData.places),
        catchError(err=>{throw new Error(errorMessage)})
      )
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:8080/user-places', "Error occurs when loading user place.")
            .pipe(tap(result=>this.userPlaces.set(result))
            )
  }

  addPlaceToUserPlaces(selectedPlace: Place) {
    const previousUserPlaces = this.userPlaces();
    if(!previousUserPlaces.some(place=>place.id==selectedPlace.id)){
      this.userPlaces.set([...this.userPlaces(),selectedPlace]);
    }

    return this.httpClient.put('http://localhost:8080/user-places',selectedPlace.id)
    .pipe(
      catchError(err=>{
        this.userPlaces.set(previousUserPlaces);
        this.errorService.showError("Failed to store selected place.")
        throw new Error("Error occurs during adding user 's favorite place.")
      })
    )
  }

  removeUserPlace(selectedPlace: Place) {
    const previousUserPlaces = this.userPlaces();

    this.userPlaces.set(previousUserPlaces.filter(userPlace=>userPlace.id!=selectedPlace.id));

    return this.httpClient.delete('http://localhost:8080/user-places/'+selectedPlace.id)
    .pipe(
      catchError(err=>{
        this.userPlaces.set(previousUserPlaces);
        throw new Error("Error occurs during removing user 's favorite place.")
      })
    )
  }
}
