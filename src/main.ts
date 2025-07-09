// Angular bootstrapping
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// App-specific imports
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Bootstrap the root component and configure providers
bootstrapApplication(AppComponent, {
  providers: [
    // Enable routing with defined app routes
    provideRouter(routes),

    // Enable HttpClient for API calls (e.g., json-server)
    importProvidersFrom(HttpClientModule)
  ]
});
