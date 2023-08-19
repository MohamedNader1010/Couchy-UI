import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        PasswordModule,
        InputTextModule
    ],

})
export class AuthModule { }
