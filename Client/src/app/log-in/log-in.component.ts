import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_guards/auth-service.guard';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../_global/-global-service.service';
import { LoginResponse } from '../_models/loginResponse';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  model: any = {};
  currentLang: any;
  constructor(
    private authService: AuthService,
    public accountservice: AccountService,
    private router: Router,
    public globalServices: GlobalServiceService
  ) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }

  login(): void {
    // Perform login logic
    this.authService.login(this.model);
    //this.authService.login();
  }

  // changeLanguage() {
  //   this.currentLang = this.globalServices.getCurrentLanguage();

  //   if (this.currentLang == '') {
  //     this.currentLang = 'en';

  //   } else if (this.currentLang == '"en"') {

  //     this.currentLang = 'ar';
  //   } else if (this.currentLang == '"ar"') {
  //     this.currentLang = 'en';

  //   } else {
  //     this.currentLang = 'ar';

  //   }

  //   this.globalServices.changeLangage(this.currentLang);
  // }

  setCurrentUser() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user: LoginResponse = JSON.parse(userString);
    this.accountservice.setCurrentUser(user);
  }
}
