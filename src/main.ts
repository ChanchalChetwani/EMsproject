/*import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

/*bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));*/

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),           // ✅ Needed for all HttpClient requests
    provideRouter(routes) ,
     provideHttpClient(withFetch())         // ✅ Needed to enable Angular routing
  ]
}).catch((err) => console.error(err));

