import { UserTypes } from "../enums/types.enums";

export interface NotifyUsers { 
    type: UserTypes; 
    title: string;
    body:string
}