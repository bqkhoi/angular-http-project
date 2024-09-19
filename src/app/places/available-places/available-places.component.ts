import { Component, signal, OnInit, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  isFetching = signal(false);
  places = signal<Place[] | undefined>(undefined);

  constructor(private httpClient:HttpClient, private destroyRef: DestroyRef){}

  ngOnInit(){
    this.isFetching.set(true)
    const subscription =
      this.httpClient.get<{ places:Place[] }>('http://localhost:8080/places')
      .pipe(
        map(resData=>resData.places)
      )
      .subscribe({
        next:(resData)=>{
          this.places.set(resData);
        },
        complete:() =>{
          this.isFetching.set(false);
        }
      });

      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      })
  }
}
