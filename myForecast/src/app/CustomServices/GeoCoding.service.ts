import { ElementRef,
         Injectable,
         NgZone,
         EventEmitter } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MapsAPILoader} from '@agm/core';
import { LocationCoordinates } from '../CustomModels/location.model';

@Injectable()
export class GeoCoadingService {
    LocationEmmiter = new EventEmitter<LocationCoordinates>();
    AddressArr = [];
    locationcoordinates: LocationCoordinates;
    UrlForGetRequeest = '';
    GoogleApiKey = 'AIzaSyDFRxceLa_qG-81HU0c4LJKQu8bNRG_BmI';
    httpClient: HttpClient;
    ngZone: NgZone;
    mapsLoaderApi: MapsAPILoader;

    constructor(httpClient: HttpClient, mapsLoaderApi: MapsAPILoader, ngZone: NgZone) {
      this.httpClient = httpClient;
      this.mapsLoaderApi = mapsLoaderApi;
      this.ngZone = ngZone;
    }

    getLatitudeAndLongitude(element : ElementRef){
        this.AddressArr =  element.nativeElement.value.split(',', 3);
        this.UrlForGetRequeest = 'https://maps.googleapis.com/maps/api/geocode/json?address='
            + this.AddressArr[0] + ',+' + this.AddressArr[1] + '+,+' + this.AddressArr[2] + '+&key=' + this.GoogleApiKey;
        this.httpClient.get(this.UrlForGetRequeest).subscribe(
            (response: any) => {
              console.log(response.results);
              this.locationcoordinates = new LocationCoordinates(this.AddressArr[0], 
                response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
              console.log(this.locationcoordinates);
              this.LocationEmmiter.emit(this.locationcoordinates);
            }
        );
    }

    doAutoComplete(searchInput: ElementRef) {
        this.mapsLoaderApi.load().then(
            () => {
              const autocomplete = new google.maps.places.Autocomplete(searchInput.nativeElement, {types: ['(cities)']});
              autocomplete.addListener('place_Changed', () => {
                this.ngZone.run(() => {
                  const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  if (place.geometry === undefined || place.geometry === null) {
                    return;
                  }
                });
              });
            }
          );
    }
}
