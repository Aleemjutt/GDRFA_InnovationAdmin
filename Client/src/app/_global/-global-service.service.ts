import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalServiceService implements OnInit {
  currentLang: any = 'en';
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

    private translateService: TranslateService
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

  getImgServerBaseUrl() {
    return 'http:\\localhost:44350\\InnovationImages\\';
  }
}
