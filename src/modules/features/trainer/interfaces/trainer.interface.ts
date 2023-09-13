import { Genders } from "src/modules/shared/enums/genders.enum";

export interface TrainerDto {
    id?: string;
    name: string;
    categoryId?: number;
    gender: number;
    email: string; 
    appFee?: number;
    isActive?: boolean;
    lang?: number;
    phoneNumber: string;
    image?: File; 
    filePath?: string;
}

