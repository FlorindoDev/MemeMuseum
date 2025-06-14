import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage.component';
import { authGuard } from './_guards/auth/auth.guard';
import { UpLoadMeme } from './up-load-meme/up-load-meme.component';

export const routes: Routes = [

    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        title: "Home Page",
        component: Homepage
    },
    {
        path: "upload",
        title: "Carica Meme",
        component: UpLoadMeme,
        canActivate: [authGuard]
    },

];
