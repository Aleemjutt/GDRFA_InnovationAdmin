import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ResponseResult } from 'src/app/_models/responseResult';
import { MembershipService } from 'src/app/_services/_about/membership.service';

@Component({
  selector: 'app-membership-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './membership-add.component.html',
  styleUrl: './membership-add.component.css',
})
export class MembershipAddComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tosterService: ToastrService,
    private memberService: MembershipService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        descriptionEn: ['', Validators.required],
        descriptionAr: ['', Validators.required],
        url: [null],
        //email: ['', [Validators.required, Validators.email]],

        // password: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     this.customValidator.patternValidator(),
        //   ]),
        // ],
        // confirmPassword: ['', [Validators.required]],
      }
      // {
      //   validator: this.customValidator.MatchPassword(
      //     'password',
      //     'confirmPassword'
      //   ),
      // }
    );
  }
  get registerFormControl() {
    return this.registerForm.controls;
  }

  addMembership() {
    console.log(this.registerForm.value, 'form values');
    this.memberService.addMembership(this.registerForm.value).subscribe({
      next: (response: ResponseResult) => {
        if (response.statusCode == 0) {
          this.tosterService.success(response.message);
        } else {
          this.tosterService.error(response.message);
        }
      },
    });
  }
}
