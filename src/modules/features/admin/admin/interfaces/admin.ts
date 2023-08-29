
import { PermissionEntry } from './../../../../shared/interfaces/permissionsEntry';

export interface AdminDto {
  id?: string;
  name: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  password: string;
  image: File;
  permissions: { [key: number]: PermissionEntry }[];
}
