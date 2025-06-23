import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

//TODO: Mettere quando è stato creato un post
//TODO: Mettere quando è stato creato un commento

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
