import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map'
import {DataService} from "../../services/data.service";
import {MarkerInfo} from "../../utils/markerInfo";

declare var jQuery: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DataService]
})
export class MapComponent implements OnInit {

  map: any;
  position: google.maps.LatLng;
  positions: any[] = [];
  styles: any[] = [];
  markers: MarkerInfo[] = [];
  countries: any[];
  continents: any[];
  oceans: any[];
  label = 1;
  colorList = ['#ff0000', '#ff9933', '#ffff00', '#669900', '#66ffcc', '#0066cc', '#cc99ff', '#660066', '#663300', '#ff9999'];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.styles = [
      {
        stylers: [
          {hue: '#000066'},
          {saturation: -20}
        ]
      },
      {
        featureType: 'landscape',
        stylers: [
          {hue: '#ffff66'},
          {saturation: 100}
        ]
      }, {
        featureType: 'road',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'administrative.land_parcel',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'administrative.locality',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'administrative.neighborhood',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'administrative.province',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'landscape.man_made',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'landscape.natural',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'poi',
        stylers: [
          {visibility: 'off'}
        ]
      }, {
        featureType: 'transit',
        stylers: [
          {visibility: 'off'}
        ]
      }
    ];
  }

  onMapReady(map) {
    this.map = map;
    this.map.setOptions({styles: this.styles});
    // console.log(this.map);
    // getting the countries lat/lon
    // this.dataService.getData()
    //   .subscribe(
    //     (data => {
    //       this.countries = data['data'];
    //       // console.log('countries', this.countries);
    //       this.drawMap();
    //     }));

    this.dataService.getContinents().subscribe(
      (data => {
        this.continents = data['data'];
        this.drawOceans(this.continents);
      }));

    // this.dataService.getOceans().subscribe(
    //   (data => {
    //     this.oceans = data['data'];
    //     this.drawOceans(this.oceans);
    //   }));

  }


  onMapClick(event, name: string) {
    const self = this;
    if (this.isPasswordFull() || this.isAlreadyChosen(name)) {
      return
    }
    if (event instanceof MouseEvent) {
      return
    }
    this.position = event['latLng'];
    this.positions.push(event.latLng);

    const icon = {
      // url: './assets/flag.png', // url
      url: './assets/m3.png', // url
      scaledSize: new google.maps.Size(28, 38), // scaled size
      labelOrigin: new google.maps.Point(12, 12)
    };

    const marker = new google.maps.Marker({
      position: this.position,
      map: this.map,
      icon: icon,
      animation: google.maps.Animation.DROP,
    });

    const infowindow = new google.maps.InfoWindow({
      content: name
    });

    marker.addListener('click', function() {

          infowindow.open(self.map, marker);
        });
    setTimeout(() => {
      marker.setLabel(this.label.toString());
      // marker.setLabel(name);
      this.updateMarkers(name);
    }, 500);

  }

  updateMarkers(name: string) {
    const marker = new MarkerInfo();
    marker.name = name;
    marker.label = this.label;
    this.markers.push(marker);
    // console.log(this.markers);
    this.label++;


  }

  isPasswordFull() {
    if (this.label > 9) {
      return true
    } else {
      return false
    }
  }

  isAlreadyChosen(name: string) {
    for (const i of this.markers) {
      if (i.name === name) {
        return true;
      }
    }
    return false;
  }

  drawContinents(data) {
    // console.log('in draw map', data);
    const self = this;
    const rows = data;
    for (const i of rows) {
      let newCoordinates = [];
      const geometries = i[0]['geometries'];
      if (geometries) {
        for (const j of geometries) {
          newCoordinates.push(this.constructNewCoordinates(j));
        }
      } else {
        newCoordinates = this.constructNewCoordinates(i[0]['geometry']);
      }
      const continents = new google.maps.Polygon({
        paths: newCoordinates,
        strokeColor: '#ff9900',
        strokeOpacity: 0,
        strokeWeight: 1,
        fillColor: '#ffff66',
        fillOpacity: 0,
        map: this.map,
      });
      google.maps.event.addListener(continents, 'mouseover', function () {
        this.setOptions({fillOpacity: 0.3});
      });
      google.maps.event.addListener(continents, 'mouseout', function () {
        this.setOptions({fillOpacity: 0});
      });

      google.maps.event.addListener(continents, 'click', function (event) {
        self.onMapClick(event, i[1]);
      });

      continents.setMap(this.map);
    }
  }


  drawOceans(data) {
    // console.log('in draw Oceans', data);
    const self = this;
    const rows = data;
    for (const i of rows) {
      if (i[0] !== 'Antarctica') {
        let newCoordinates = [];
        const geometries = i[1]['geometries'];
        if (geometries) {
          for (const j of geometries) {
            newCoordinates.push(this.constructNewCoordinates(j));
          }
        } else {
          newCoordinates = this.constructNewCoordinates(i[1]['geometry']);
        }
        const country = new google.maps.Polygon({
          paths: newCoordinates,
          strokeColor: '#ff9900',
          strokeOpacity: 0,
          strokeWeight: 1,
          fillColor: '#ffff66',
          fillOpacity: 0,
          map: this.map
          // name: i[0]
        });
        google.maps.event.addListener(country, 'mouseover', function () {
          this.setOptions({fillOpacity: 0.3});
        });
        google.maps.event.addListener(country, 'mouseout', function () {
          this.setOptions({fillOpacity: 0});
        });

        google.maps.event.addListener(country, 'click', function (event) {
          // console.log(self.markers);
          if (!self.isPasswordFull() && !self.isAlreadyChosen(name)) {
            const p = new google.maps.Polygon({
              paths: newCoordinates,
              strokeColor: '#ff9900',
              strokeOpacity: 0,
              strokeWeight: 1,
              fillColor: self.colorList[self.label - 1],
              fillOpacity: 0.5,
              map: this.map
            });
            p.setMap(self.map)
          }
          self.onMapClick(event, i[0]);

        });
        country.setMap(this.map);
      }
    }
  }


  constructNewCoordinates(polygon) {
    let newCoordinates = [];
    let coordinates = polygon['coordinates'][0];
    for (const i of coordinates) {
      newCoordinates.push(
        new google.maps.LatLng(i[1], i[0]));
    }
    return newCoordinates;
  }


}
