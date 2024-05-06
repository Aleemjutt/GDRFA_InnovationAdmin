export interface User {
  userName: string;
  token: string;
}

export interface UserModel {
  Id: 0;
  titleEn: string | null;
  titleAr: string | null;
  firstNameEn: string | null;
  firstNameAr: string | null;
  lastNameEn: string | null;
  lastNameAr: string | null;
  userName: string | null;
  email: string | null;
  password: string | null;
  mobileNumber: string;
  confirmPassword: string | null;
  token: string | null;
  expireDateTimeString: string | null;
  refreshToken: string;
  userStatus: boolean;
  roleId: number | null;
  url: string | null;
}
