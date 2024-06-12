import { Injectable, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  constructor(private accountServiec: AccountService, private router: Router) {}
  ngOnInit(): void {}
  private isAuthenticated = false;

  login(model: any): void {
    this.accountServiec.login(model).subscribe({
      next: (response) => {
        this.accountServiec.currentUser$.pipe(take(1)).subscribe({
          next: (user) => {
            if (user) {
              
              this.router.navigateByUrl('/userProfile');
              this.isAuthenticated = true;
            }
          },
        });
      },
      error: (error) => {
        this.router.navigateByUrl('/login');
      },
    });

    // Perform authentication logic
    // Set isAuthenticated to true upon successful login
    //this.isAuthenticated = true;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
