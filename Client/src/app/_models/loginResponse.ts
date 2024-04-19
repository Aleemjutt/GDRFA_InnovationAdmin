export class LoginResponse {
  access_token: string | undefined;
  token_type: string | undefined;
  expires_in: number = 0;
  refresh_token: string | undefined;
  client_id: string | undefined;
  userName: string | undefined;
  userId: string | undefined;
  isManager: string | undefined;
  currentManagerId: string | undefined;
  managerId: string | undefined;
  roles: string | undefined;
  issued: string | undefined;
  expires: string | undefined;
  userRole: string | undefined;
}
