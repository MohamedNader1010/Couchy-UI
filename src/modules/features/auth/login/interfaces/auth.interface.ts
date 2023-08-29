import { LanguageEnum } from "src/modules/shared/enums/languages.enums";

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
