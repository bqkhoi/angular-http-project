import { Component, signal, OnInit, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  isFetching = signal(false);
  error = signal("");
  places = signal<Place[] | undefined>(undefined);
  newUserPlace = signal<Place | undefined>(undefined);

  constructor(private placeService:PlacesService, private destroyRef: DestroyRef){}

  ngOnInit(){
    this.isFetching.set(true)
    const subscription =
      this.placeService.loadAvailablePlaces()
      .subscribe({
          next:(resData)=>{
            this.places.set(resData);
          },
          error:(error)=>{this.error.set(error.message);},
          complete:() =>{
            this.isFetching.set(false);
          }
        });

      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      })
  }

  addUserPlace(selectedPlace:Place){
    const subscription = this.placeService.addPlaceToUserPlaces(selectedPlace).subscribe();
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    });
  }
}
