import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toasterService = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) return true;
      else {
        toasterService.error('you shell not passed!');
        return false;
      }
    })
  );
};
