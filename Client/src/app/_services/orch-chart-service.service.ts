import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalServiceService } from '../_global/-global-service.service';

@Injectable({
  providedIn: 'root',
})
export class OrchChartServiceService {
  baseUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,

    private globalService: GlobalServiceService
  ) {}

  getDepartment() {
    return this.httpClient.get<any>(
      this.baseUrl + 'OrchChart/GetDepartments/1/0/0/0/0',
      this.globalService.getHttpOptions()
    );
  }

  getDepartmentsOnly() {
    return this.httpClient.get<any>(
      this.baseUrl + 'OrchChart/GetDepartments',
      this.globalService.getHttpOptions()
    );
  }

  getDepartmentbySectorId(sectorId: number) {
    return this.httpClient.get<any>(
      this.baseUrl + 'OrchChart/GetDepartments/0/' + sectorId + '/0/0/0',
      this.globalService.getHttpOptions()
    );
  }

  getKIPProcesses(levelId: number) {
    return this.httpClient.get<any>(
      this.baseUrl + 'OrchChart/GetKPIProcesses?levelId=' + levelId,
      this.globalService.getHttpOptions()
      //this.getHttpOptions()
    );
  }

  // getPeople(): Observable<any[]> {
  //   /// let items = this.getDepartment();
  //   // if (term) {
  //   //   items = items.filter(
  //   //     (x) => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1
  //   //   );
  //   // }

  //   return this.httpClient.get<any>(
  //     this.baseUrl + 'OrchChart/GetDepartments/1/0/0/0/0',
  //     this.globalService.getHttpOptions()
  //   );
  //   //return of(items).pipe(delay(500));
  // }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.value.access_token,
        'Accept-Language': this.globalService.getCurrentLanguage(),
      }),
    };
  }
}
