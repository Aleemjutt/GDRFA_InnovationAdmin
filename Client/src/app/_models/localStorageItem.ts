import { LoginResponse } from './loginResponse';

export class StorageItem {
  expiration: number | undefined;
  value: LoginResponse | undefined;
}
