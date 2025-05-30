import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage.component';
import { authGuard } from './_guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: "",
        title: "Home Page",
        component: Homepage
    }


];
