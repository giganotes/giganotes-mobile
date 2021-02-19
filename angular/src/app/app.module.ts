import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@angular/cdk/layout';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTreeModule} from '@angular/material/tree';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppConfig } from '../environments/environment';

import { AppComponent } from './app.component';


import { AuthGuard } from './guards/auth-guard';
import { AuthService } from './services/auth-service';
import { AuthServiceConfig, SocialAuthService } from './services/social-auth/social-auth-service';
import { GoogleLoginProvider } from './services/social-auth/google-login-provider';

export function provideSocialConfig(http: HttpClient, interopService: InteropService) {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(http, interopService)
    },
  ]);
}

import { Storage } from './services/storage';

import { LoggerService } from './services/logger-service';
import { NoteManagerService } from './services/note-manager-service';
import { SyncService } from './services/sync-service';
import { ScreenService } from './services/screen.service';

import { EventBusService } from './services/event-bus-service';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import {InteropService} from './services/interop.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    MatProgressBarModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    Storage,
    LoggerService,
    NoteManagerService,
    SyncService,
    AuthGuard,
    AuthService,
    EventBusService,
    SocialAuthService,
    InteropService,
    ScreenService,
    DynamicScriptLoaderService,
    {
      provide: AuthServiceConfig,
      useFactory: provideSocialConfig,
      deps: [HttpClient, InteropService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
