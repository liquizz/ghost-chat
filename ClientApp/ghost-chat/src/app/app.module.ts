import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { GRPC_CHAT_SERVICE_CLIENT_SETTINGS } from './proto/chat.pbconf';
import { routes } from './app.routes';

@NgModule({
  imports: [
    AppComponent,
    ChatComponent,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host: 'http://localhost:5040' }
    })
  ],
  providers: [
    { provide: GRPC_CHAT_SERVICE_CLIENT_SETTINGS, useValue: { host: 'http://localhost:5040' } }
  ],
  bootstrap: []
})
export class AppModule { }