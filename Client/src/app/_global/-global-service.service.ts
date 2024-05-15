import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkFlowStatus } from '../_models/Common/workflowStatus';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GlobalServiceService implements OnInit {
  currentLang: any = 'en';
  baseUrl = environment.apiUrl;
  imgServerBaseUrl: string = '';
  private languageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('en');
  public languageChange$: Observable<string> =
    this.languageSubject.asObservable();

  userType: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getUserType()
  );
  bindLabel: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,

    private translateService: TranslateService,
    private httpClient: HttpClient //private globalService : GlobalServiceService
  ) {
    this.bindLabel = '';
  }
  ngOnInit(): void {
    // this.changeLangage(this.currentLang);
  }
  getCurrentLanguage() {
    const storedLanguage = localStorage.getItem('currentLanguage');
    if (storedLanguage != '' && storedLanguage != null) {
      const _currentLang = storedLanguage
        ? storedLanguage.trim().replace(/["']/g, '')
        : '';
      //localStorage.getItem('currentLanguage');
      //this.currentLang = this.currentLang;

      this.currentLang =
        _currentLang != null || _currentLang != '' ? _currentLang : 'en';
    } else {
      this.currentLang = 'ar';
    }

    return this.currentLang;
  }

  changeLangage(lang: string) {
    //this.currentLangSet = lang;

    let htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;

    localStorage.setItem('currentLanguage', JSON.stringify(lang));
    this.currentLang = lang;
    htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';

    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.changeCssFile(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      'head'
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      'langCss'
    ) as HTMLLinkElement;
    let existing_bootStrapLink = this.document.getElementById(
      'boostrap'
    ) as HTMLLinkElement;

    let bundleName = lang === 'ar' ? 'arabicStyle.css' : 'englishStyle.css';

    let bundleName_Boostrap =
      lang === 'ar' ? 'bootstrapRtl.css' : 'bootstrapLtr.css';

    if (existingLink) {
      existing_bootStrapLink.href = bundleName_Boostrap;
      //existing_bootStrapLink.href;

      existingLink.href = bundleName;
      //existingLink.href;
    } else {
      let newLink_boostrap = this.document.createElement('link');
      newLink_boostrap.rel = 'stylesheet';
      newLink_boostrap.type = 'text/css';
      newLink_boostrap.id = 'boostrap';
      newLink_boostrap.href = bundleName_Boostrap;
      headTag.appendChild(newLink_boostrap);

      let newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;

      headTag.appendChild(newLink);
    }
  }

  getUserId() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value.userId;
  }

  getUserType() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value.roles;
  }

  getUserLogin() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value;
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.value.access_token,
        'Accept-Language': this.getCurrentLanguage(),
      }),
    };
  }

  getWorkFlowStatusName(workFlow: WorkFlowStatus) {
    let workFlowStatusName = '';

    switch (workFlow) {
      case WorkFlowStatus.UnderProcesses:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-info">Under Evaluation</span>'
            : '<span class="badge bg-info">تحت العملية</span>';
        break;
      case WorkFlowStatus.Reject:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-danger">Rejected</span>'
            : '<span class="badge bg-danger">مرفوض</span>';
        break;
      case WorkFlowStatus.Approved:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-primary">Approved</span>'
            : '<span class="badge bg-primary">موافقة</span>';
        break;
      case WorkFlowStatus.Accept:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-primary">Accepted</span>'
            : '<span class="badge bg-primary">مقبول</span>';
        break;

      default:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-secondary">Submit</span>'
            : '<span class="badge bg-secondary">تقديم</span>';
        break;
    }

    return workFlowStatusName;
  }
  getStatusName(status: boolean) {
    let statuName = '';
    if (status) {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-success">Active</span>'
          : '<span class="badge badge-success">نشيط</span>';
    } else {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-info">In-Active</span>'
          : '<span class="badge badge-info">غير نشط</span>';
    }

    return statuName;
  }
  getImgServerBaseUrl(base64String: string | null): string {
    //console.log(base64String, 'Base 64');
    this.imgServerBaseUrl = '';
    if (base64String) {
      this.imgServerBaseUrl = 'data:image/*;base64,' + base64String;
    }
    // console.log(base64String, 'Combined Base 64');
    // this.httpClient.get<string>(this.baseUrl + 'FilePath?url=' + url).subscribe(
    //   (response) => {
    //     this.imgServerBaseUrl = 'data:image/jpeg;base64,' + response;
    //   },
    //   (error) => {
    //     console.error('Error fetching image:', error);
    //   }
    // );

    return this.imgServerBaseUrl;
  }

  isBase64Image(base64String: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Error loading image

      // Set the Base64 string as the image source
      img.src = base64String;
    });
  }

  async checkImage(base64String: string) {
    const isValid = await this.isBase64Image(base64String);
    console.log(isValid ? 'Valid image' : 'Invalid image');

    return isValid;
  }
  // getImgServerBaseUrl(): Observable<string> {
  //   return this.getFromServerBaseUrl().pipe(
  //     map(() => 'http://localhost:44350/InnovationImages/'),
  //     catchError(() => 'http://localhost:44350/InnovationImages/')
  //   );
  // }

  // getFromServerBaseUrl(): Observable<any> {
  //   return this.httpClient.get<any>(
  //     this.baseUrl + 'FilePath',
  //     this.getHttpOptions()
  //   );
  // }
  // getImgServerBaseUrl() {
  //   const fromServer = this.getFromServerBaseUrl();
  //   console.log('server file path', fromServer);
  //   if (fromServer) {
  //     return 'http:\\localhost:44350\\InnovationImages\\';
  //   } else {
  //     return fromServer; //'http:\\localhost:44350\\InnovationImages\\';
  //   }
  // }

  // getFromServerBaseUrl() {
  //   // Replace 'http:\\localhost:44350\\InnovationImages\\' with your default string value
  //   //const defaultValue = 'htpps//:';
  //   return this.httpClient.put<any>(
  //     this.baseUrl + 'FilePath',
  //     this.getHttpOptions()
  //   );
  // }
}
