/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GrpcCallType,
  GrpcClient,
  GrpcClientFactory,
  GrpcEvent,
  GrpcMetadata
} from '@ngx-grpc/common';
import {
  GRPC_CLIENT_FACTORY,
  GrpcHandler,
  takeMessages,
  throwStatusErrors
} from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import * as thisProto from './chat.pb';
import { GRPC_CHAT_SERVICE_CLIENT_SETTINGS } from './chat.pbconf';
/**
 * Service client implementation for chat.ChatService
 */
@Injectable({ providedIn: 'any' })
export class ChatServiceClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /chat.ChatService/JoinChat
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.SessionResponse>>
     */
    joinChat: (
      requestData: thisProto.SessionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.SessionResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/chat.ChatService/JoinChat',
        requestData,
        requestMetadata,
        requestClass: thisProto.SessionRequest,
        responseClass: thisProto.SessionResponse
      });
    },
    /**
     * Unary call: /chat.ChatService/SendMessage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.MessageAck>>
     */
    sendMessage: (
      requestData: thisProto.MessageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.MessageAck>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/chat.ChatService/SendMessage',
        requestData,
        requestMetadata,
        requestClass: thisProto.MessageRequest,
        responseClass: thisProto.MessageAck
      });
    },
    /**
     * Server streaming: /chat.ChatService/MessageStream
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.MessageResponse>>
     */
    messageStream: (
      requestData: thisProto.StreamRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.MessageResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/chat.ChatService/MessageStream',
        requestData,
        requestMetadata,
        requestClass: thisProto.StreamRequest,
        responseClass: thisProto.MessageResponse
      });
    },
    /**
     * Unary call: /chat.ChatService/KeyExchange
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.KeyResponse>>
     */
    keyExchange: (
      requestData: thisProto.KeyRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.KeyResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/chat.ChatService/KeyExchange',
        requestData,
        requestMetadata,
        requestClass: thisProto.KeyRequest,
        responseClass: thisProto.KeyResponse
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_CHAT_SERVICE_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient('chat.ChatService', settings);
  }

  /**
   * Unary call @/chat.ChatService/JoinChat
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.SessionResponse>
   */
  joinChat(
    requestData: thisProto.SessionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.SessionResponse> {
    return this.$raw
      .joinChat(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/chat.ChatService/SendMessage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.MessageAck>
   */
  sendMessage(
    requestData: thisProto.MessageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.MessageAck> {
    return this.$raw
      .sendMessage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/chat.ChatService/MessageStream
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.MessageResponse>
   */
  messageStream(
    requestData: thisProto.StreamRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.MessageResponse> {
    return this.$raw
      .messageStream(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/chat.ChatService/KeyExchange
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.KeyResponse>
   */
  keyExchange(
    requestData: thisProto.KeyRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.KeyResponse> {
    return this.$raw
      .keyExchange(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
