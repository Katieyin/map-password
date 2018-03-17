import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, URLSearchParams, RequestOptions} from '@angular/http';
import {API_KEY, CLIENT_SECRET} from "../utils/token";

declare var require: any;

@Injectable()
export class DataService {
  options: any;

  constructor(private http: Http) {
    this.setHeaders();
  }

  setHeaders() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + CLIENT_SECRET);

    this.options = new RequestOptions({headers: headers});
  }

  getData(): Observable<any> {
    let url = 'https://www.googleapis.com/fusiontables/v2/query?';
    url = url + 'sql=';
    const query = 'SELECT name, kml_4326 FROM ' + '1foc3xO9DyfSIF6ofvN0kp2bxSfSeKog5FbdWdQ';
    const encodedQuery = encodeURIComponent(query);
    url = url + encodedQuery;
    url = url + '&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ';
    console.log(url);

    return this.http.get(url)
      .map(data => {
        const countries = data.json();
        // console.log(countries);
        return {
          data: countries['rows']
        }
      });
  }

  getContinents(): Observable<any> {
    // let url = 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT geometry, CONTINENT FROM 1Ep6prwb941jMjmMxqD_BsISZj6JCiAE76mFcAiYl';
    let url = 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT name, kml_4326 FROM 1N29mI2S1DYtAHxGh0InhhMrqolZaZLrsQHun2kqc';
    url = url + '&key=' + API_KEY;
    console.log(url);

    return this.http.get(
      url,
    )
      .map(data => {
        const continents = data.json();
        console.log(continents);
        return {
          data: continents['rows']
        }
      });
  }

  getOceans(): Observable<any> {
    let url = 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT name, kml_4326 FROM 1PSCcG2gw3ZOpTd7vBgFG3tQ7R3ScXN-W2oOcpQ';
    url = url + '&key=' + API_KEY;
    console.log(url);

    return this.http.get(
      url,
    )
      .map(data => {
        const oceans = data.json();
        console.log('wffwwf', oceans);
        return {
          data: oceans['rows']
        }
      });
  }
}
