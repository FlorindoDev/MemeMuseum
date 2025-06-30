import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage.component';
import { authGuard } from './_guards/auth/auth.guard';
import { UpLoadMeme } from './up-load-meme/up-load-meme.component';
import { MemePage } from './meme-page/meme-page';
import { Search } from './search/search.component';
import { Profile } from './profile/profile.component';

export const routes: Routes = [

    {
        path: 'memes/:id',
        title: "meme",
        component: MemePage
    },
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
        path: "search",
        title: "Search Page",
        component: Search
    },
    {
        path: "users/:id",
        title: "Profile Page",
        component: Profile
    },
    {
        path: "upload",
        title: "Carica Meme",
        component: UpLoadMeme,
        canActivate: [authGuard]
    },

];
