export interface Auth {
  email: string;
  id: number;
  isSuccess: boolean;
  lang: LanguageEnum;
  mobileNumber: string;
  userName: string;
  token: string;
  expiresOn: Date;
  roles: string[];
}
export enum LanguageEnum {
  Arabic = 1,
  English = 2,
}
