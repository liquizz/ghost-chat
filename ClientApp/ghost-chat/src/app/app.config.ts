import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { GRPC_CLIENT_FACTORY, GrpcHandler, GrpcLoggerInterceptor } from '@ngx-grpc/core';
import { GrpcWebClientFactory } from '@ngx-grpc/grpc-web-client';

import { routes } from './app.routes';
import { GRPC_CHAT_SERVICE_CLIENT_SETTINGS } from './proto/chat.pbconf';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    { provide: GRPC_CHAT_SERVICE_CLIENT_SETTINGS, useValue: { host: 'http://192.168.1.223:5040' } },
    { provide: GRPC_CLIENT_FACTORY, useClass: GrpcWebClientFactory },
    { provide: GrpcHandler, useFactory: () => new GrpcHandler([new GrpcLoggerInterceptor()]) }
  ]
};
