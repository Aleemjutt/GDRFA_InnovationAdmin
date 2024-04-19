import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GlobalServiceService } from './_global/-global-service.service';
import { LoginResponse } from './_models/loginResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Request Operation';
  users: any;
  currentLang: any = 'ar';
  userType: string = '';
  constructor(
    public accountServices: AccountService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private changeDetector: ChangeDetectorRef,
    private globalServices: GlobalServiceService
  ) {}
  ngOnInit(): void {
    this.globalServices.changeLangage(this.globalServices.getCurrentLanguage());
    this.setCurrentUser();

    //this.globalServices.userType.subscribe((value) => (this.userType = value));

    console.log(this.globalServices.getUserType(), 'usertype');
  }
  onLogin() {
    this.router.navigate(['/login']);
  }

  // changeLanguage() {
  //   this.currentLang = this.globalServices.getCurrentLanguage();

  //   if (this.currentLang == '') {
  //     this.currentLang = 'en';
  //
  //   } else if (this.currentLang == '"en"') {
  //
  //     this.currentLang = 'ar';
  //   } else if (this.currentLang == '"ar"') {
  //     this.currentLang = 'en';
  //
  //   } else {
  //     this.currentLang = 'ar';
  //
  //   }
  //
  //   //this.globalServices.changeLangage(this.currentLang);
  // }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: LoginResponse = JSON.parse(userString);

    this.accountServices.setCurrentUser(user);
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
