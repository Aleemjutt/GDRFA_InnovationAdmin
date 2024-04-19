import { Component, Inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { TranslateService } from '@ngx-translate/core';
import { GlobalServiceService } from '../_global/-global-service.service';
import { DOCUMENT } from '@angular/common';

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
  //currentUser$: Observable<User | null> = of(null);
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
    //this.currentUser$ = this.accountservice.currentUsre$;
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
