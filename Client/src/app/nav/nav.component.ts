import { Component, Inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { TranslateService } from '@ngx-translate/core';
import { GlobalServiceService } from '../_global/-global-service.service';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserModel } from '../_models/user';
import { LoginResponse } from '../_models/loginResponse';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class NavComponent implements OnInit {
  model: any = {};
  currentLang: any;
  userLoginModel: any;
  userFullName: string | undefined;
  //private currentUserSource = new BehaviorSubject<LoginResponse | null>(null);

  //_currentUser$ = this.currentUserSource.asObservable();
  constructor(
    public accountservice: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private translateService: TranslateService,
    public globalService: GlobalServiceService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.globalService.getCurrentLanguage();

    //this.getCurrentUser();

    this.userLoginModel = this.globalService.getUserLogin();
  }

  setUserFullName(_userLoginModel: any): string {
    console.log(_userLoginModel, 'usermodel');
    let firstName =
      this.globalService.getCurrentLanguage() === 'en'
        ? _userLoginModel.firstNameEn
        : _userLoginModel.firstNameAr;
    let lastName =
      this.globalService.getCurrentLanguage() === 'en'
        ? _userLoginModel.lastNameEn
        : _userLoginModel.lastNameAr;

    return firstName + lastName != null ? lastName : '';
  }

  // changeLanguage() {
  //   this.currentLang = this.globalService.getCurrentLanguage();

  //   if (this.currentLang == '') {
  //     this.currentLang = 'en';

  //   } else if (this.currentLang == '"en"') {

  //     this.currentLang = 'ar';
  //   } else if (this.currentLang == '"ar"') {
  //     this.currentLang = 'en';

  //   } else {
  //     this.currentLang = 'ar';

  //   }

  //   this.globalService.changeLangage(this.currentLang);
  // }

  logOut() {
    this.accountservice.logout();
    this.router.navigateByUrl('/');
  }
}
