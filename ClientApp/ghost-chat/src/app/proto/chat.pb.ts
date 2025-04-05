/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import {
  GrpcMessage,
  RecursivePartial,
  ToProtobufJSONOptions,
  uint8ArrayToBase64
} from '@ngx-grpc/common';
import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';

/**
 * Message implementation for chat.SessionRequest
 */
export class SessionRequest implements GrpcMessage {
  static id = 'chat.SessionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionRequest();
    SessionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionRequest) {
    _instance.pseudonym = _instance.pseudonym || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.pseudonym = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SessionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.pseudonym) {
      _writer.writeString(1, _instance.pseudonym);
    }
  }

  private _pseudonym: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionRequest.AsObject>) {
    _value = _value || {};
    this.pseudonym = _value.pseudonym;
    SessionRequest.refineValues(this);
  }
  get pseudonym(): string {
    return this._pseudonym;
  }
  set pseudonym(value: string) {
    this._pseudonym = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionRequest.AsObject {
    return {
      pseudonym: this.pseudonym
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SessionRequest.AsProtobufJSON {
    return {
      pseudonym: this.pseudonym
    };
  }
}
export module SessionRequest {
  /**
   * Standard JavaScript object representation for SessionRequest
   */
  export interface AsObject {
    pseudonym: string;
  }

  /**
   * Protobuf JSON representation for SessionRequest
   */
  export interface AsProtobufJSON {
    pseudonym: string;
  }
}

/**
 * Message implementation for chat.SessionResponse
 */
export class SessionResponse implements GrpcMessage {
  static id = 'chat.SessionResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionResponse();
    SessionResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionResponse) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.createdAt = _instance.createdAt || '0';
    _instance.success = _instance.success || false;
    _instance.errorMessage = _instance.errorMessage || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.createdAt = _reader.readInt64String();
          break;
        case 3:
          _instance.success = _reader.readBool();
          break;
        case 4:
          _instance.errorMessage = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SessionResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.createdAt) {
      _writer.writeInt64String(2, _instance.createdAt);
    }
    if (_instance.success) {
      _writer.writeBool(3, _instance.success);
    }
    if (_instance.errorMessage) {
      _writer.writeString(4, _instance.errorMessage);
    }
  }

  private _sessionId: string;
  private _createdAt: string;
  private _success: boolean;
  private _errorMessage: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionResponse.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.createdAt = _value.createdAt;
    this.success = _value.success;
    this.errorMessage = _value.errorMessage;
    SessionResponse.refineValues(this);
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }
  get createdAt(): string {
    return this._createdAt;
  }
  set createdAt(value: string) {
    this._createdAt = value;
  }
  get success(): boolean {
    return this._success;
  }
  set success(value: boolean) {
    this._success = value;
  }
  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionResponse.AsObject {
    return {
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      success: this.success,
      errorMessage: this.errorMessage
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SessionResponse.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      createdAt: this.createdAt,
      success: this.success,
      errorMessage: this.errorMessage
    };
  }
}
export module SessionResponse {
  /**
   * Standard JavaScript object representation for SessionResponse
   */
  export interface AsObject {
    sessionId: string;
    createdAt: string;
    success: boolean;
    errorMessage: string;
  }

  /**
   * Protobuf JSON representation for SessionResponse
   */
  export interface AsProtobufJSON {
    sessionId: string;
    createdAt: string;
    success: boolean;
    errorMessage: string;
  }
}

/**
 * Message implementation for chat.MessageRequest
 */
export class MessageRequest implements GrpcMessage {
  static id = 'chat.MessageRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new MessageRequest();
    MessageRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: MessageRequest) {
    _instance.senderId = _instance.senderId || '';
    _instance.recipientId = _instance.recipientId || '';
    _instance.encryptedPayload = _instance.encryptedPayload || new Uint8Array();
    _instance.timestamp = _instance.timestamp || '0';
    _instance.nonce = _instance.nonce || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: MessageRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.senderId = _reader.readString();
          break;
        case 2:
          _instance.recipientId = _reader.readString();
          break;
        case 3:
          _instance.encryptedPayload = _reader.readBytes();
          break;
        case 4:
          _instance.timestamp = _reader.readInt64String();
          break;
        case 5:
          _instance.nonce = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    MessageRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: MessageRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.senderId) {
      _writer.writeString(1, _instance.senderId);
    }
    if (_instance.recipientId) {
      _writer.writeString(2, _instance.recipientId);
    }
    if (_instance.encryptedPayload && _instance.encryptedPayload.length) {
      _writer.writeBytes(3, _instance.encryptedPayload);
    }
    if (_instance.timestamp) {
      _writer.writeInt64String(4, _instance.timestamp);
    }
    if (_instance.nonce && _instance.nonce.length) {
      _writer.writeBytes(5, _instance.nonce);
    }
  }

  private _senderId: string;
  private _recipientId: string;
  private _encryptedPayload: Uint8Array;
  private _timestamp: string;
  private _nonce: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of MessageRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<MessageRequest.AsObject>) {
    _value = _value || {};
    this.senderId = _value.senderId;
    this.recipientId = _value.recipientId;
    this.encryptedPayload = _value.encryptedPayload;
    this.timestamp = _value.timestamp;
    this.nonce = _value.nonce;
    MessageRequest.refineValues(this);
  }
  get senderId(): string {
    return this._senderId;
  }
  set senderId(value: string) {
    this._senderId = value;
  }
  get recipientId(): string {
    return this._recipientId;
  }
  set recipientId(value: string) {
    this._recipientId = value;
  }
  get encryptedPayload(): Uint8Array {
    return this._encryptedPayload;
  }
  set encryptedPayload(value: Uint8Array) {
    this._encryptedPayload = value;
  }
  get timestamp(): string {
    return this._timestamp;
  }
  set timestamp(value: string) {
    this._timestamp = value;
  }
  get nonce(): Uint8Array {
    return this._nonce;
  }
  set nonce(value: Uint8Array) {
    this._nonce = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    MessageRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): MessageRequest.AsObject {
    return {
      senderId: this.senderId,
      recipientId: this.recipientId,
      encryptedPayload: this.encryptedPayload
        ? this.encryptedPayload.subarray(0)
        : new Uint8Array(),
      timestamp: this.timestamp,
      nonce: this.nonce ? this.nonce.subarray(0) : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): MessageRequest.AsProtobufJSON {
    return {
      senderId: this.senderId,
      recipientId: this.recipientId,
      encryptedPayload: this.encryptedPayload
        ? uint8ArrayToBase64(this.encryptedPayload)
        : '',
      timestamp: this.timestamp,
      nonce: this.nonce ? uint8ArrayToBase64(this.nonce) : ''
    };
  }
}
export module MessageRequest {
  /**
   * Standard JavaScript object representation for MessageRequest
   */
  export interface AsObject {
    senderId: string;
    recipientId: string;
    encryptedPayload: Uint8Array;
    timestamp: string;
    nonce: Uint8Array;
  }

  /**
   * Protobuf JSON representation for MessageRequest
   */
  export interface AsProtobufJSON {
    senderId: string;
    recipientId: string;
    encryptedPayload: string;
    timestamp: string;
    nonce: string;
  }
}

/**
 * Message implementation for chat.MessageAck
 */
export class MessageAck implements GrpcMessage {
  static id = 'chat.MessageAck';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new MessageAck();
    MessageAck.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: MessageAck) {
    _instance.success = _instance.success || false;
    _instance.errorMessage = _instance.errorMessage || '';
    _instance.messageId = _instance.messageId || '';
    _instance.serverTimestamp = _instance.serverTimestamp || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: MessageAck,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.success = _reader.readBool();
          break;
        case 2:
          _instance.errorMessage = _reader.readString();
          break;
        case 3:
          _instance.messageId = _reader.readString();
          break;
        case 4:
          _instance.serverTimestamp = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    MessageAck.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: MessageAck, _writer: BinaryWriter) {
    if (_instance.success) {
      _writer.writeBool(1, _instance.success);
    }
    if (_instance.errorMessage) {
      _writer.writeString(2, _instance.errorMessage);
    }
    if (_instance.messageId) {
      _writer.writeString(3, _instance.messageId);
    }
    if (_instance.serverTimestamp) {
      _writer.writeInt64String(4, _instance.serverTimestamp);
    }
  }

  private _success: boolean;
  private _errorMessage: string;
  private _messageId: string;
  private _serverTimestamp: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of MessageAck to deeply clone from
   */
  constructor(_value?: RecursivePartial<MessageAck.AsObject>) {
    _value = _value || {};
    this.success = _value.success;
    this.errorMessage = _value.errorMessage;
    this.messageId = _value.messageId;
    this.serverTimestamp = _value.serverTimestamp;
    MessageAck.refineValues(this);
  }
  get success(): boolean {
    return this._success;
  }
  set success(value: boolean) {
    this._success = value;
  }
  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
  }
  get messageId(): string {
    return this._messageId;
  }
  set messageId(value: string) {
    this._messageId = value;
  }
  get serverTimestamp(): string {
    return this._serverTimestamp;
  }
  set serverTimestamp(value: string) {
    this._serverTimestamp = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    MessageAck.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): MessageAck.AsObject {
    return {
      success: this.success,
      errorMessage: this.errorMessage,
      messageId: this.messageId,
      serverTimestamp: this.serverTimestamp
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): MessageAck.AsProtobufJSON {
    return {
      success: this.success,
      errorMessage: this.errorMessage,
      messageId: this.messageId,
      serverTimestamp: this.serverTimestamp
    };
  }
}
export module MessageAck {
  /**
   * Standard JavaScript object representation for MessageAck
   */
  export interface AsObject {
    success: boolean;
    errorMessage: string;
    messageId: string;
    serverTimestamp: string;
  }

  /**
   * Protobuf JSON representation for MessageAck
   */
  export interface AsProtobufJSON {
    success: boolean;
    errorMessage: string;
    messageId: string;
    serverTimestamp: string;
  }
}

/**
 * Message implementation for chat.StreamRequest
 */
export class StreamRequest implements GrpcMessage {
  static id = 'chat.StreamRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new StreamRequest();
    StreamRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: StreamRequest) {
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: StreamRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    StreamRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: StreamRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
  }

  private _sessionId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of StreamRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<StreamRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    StreamRequest.refineValues(this);
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    StreamRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): StreamRequest.AsObject {
    return {
      sessionId: this.sessionId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): StreamRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId
    };
  }
}
export module StreamRequest {
  /**
   * Standard JavaScript object representation for StreamRequest
   */
  export interface AsObject {
    sessionId: string;
  }

  /**
   * Protobuf JSON representation for StreamRequest
   */
  export interface AsProtobufJSON {
    sessionId: string;
  }
}

/**
 * Message implementation for chat.MessageResponse
 */
export class MessageResponse implements GrpcMessage {
  static id = 'chat.MessageResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new MessageResponse();
    MessageResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: MessageResponse) {
    _instance.messageId = _instance.messageId || '';
    _instance.senderId = _instance.senderId || '';
    _instance.recipientId = _instance.recipientId || '';
    _instance.encryptedPayload = _instance.encryptedPayload || new Uint8Array();
    _instance.timestamp = _instance.timestamp || '0';
    _instance.nonce = _instance.nonce || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: MessageResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.messageId = _reader.readString();
          break;
        case 2:
          _instance.senderId = _reader.readString();
          break;
        case 3:
          _instance.recipientId = _reader.readString();
          break;
        case 4:
          _instance.encryptedPayload = _reader.readBytes();
          break;
        case 5:
          _instance.timestamp = _reader.readInt64String();
          break;
        case 6:
          _instance.nonce = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    MessageResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: MessageResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.messageId) {
      _writer.writeString(1, _instance.messageId);
    }
    if (_instance.senderId) {
      _writer.writeString(2, _instance.senderId);
    }
    if (_instance.recipientId) {
      _writer.writeString(3, _instance.recipientId);
    }
    if (_instance.encryptedPayload && _instance.encryptedPayload.length) {
      _writer.writeBytes(4, _instance.encryptedPayload);
    }
    if (_instance.timestamp) {
      _writer.writeInt64String(5, _instance.timestamp);
    }
    if (_instance.nonce && _instance.nonce.length) {
      _writer.writeBytes(6, _instance.nonce);
    }
  }

  private _messageId: string;
  private _senderId: string;
  private _recipientId: string;
  private _encryptedPayload: Uint8Array;
  private _timestamp: string;
  private _nonce: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of MessageResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<MessageResponse.AsObject>) {
    _value = _value || {};
    this.messageId = _value.messageId;
    this.senderId = _value.senderId;
    this.recipientId = _value.recipientId;
    this.encryptedPayload = _value.encryptedPayload;
    this.timestamp = _value.timestamp;
    this.nonce = _value.nonce;
    MessageResponse.refineValues(this);
  }
  get messageId(): string {
    return this._messageId;
  }
  set messageId(value: string) {
    this._messageId = value;
  }
  get senderId(): string {
    return this._senderId;
  }
  set senderId(value: string) {
    this._senderId = value;
  }
  get recipientId(): string {
    return this._recipientId;
  }
  set recipientId(value: string) {
    this._recipientId = value;
  }
  get encryptedPayload(): Uint8Array {
    return this._encryptedPayload;
  }
  set encryptedPayload(value: Uint8Array) {
    this._encryptedPayload = value;
  }
  get timestamp(): string {
    return this._timestamp;
  }
  set timestamp(value: string) {
    this._timestamp = value;
  }
  get nonce(): Uint8Array {
    return this._nonce;
  }
  set nonce(value: Uint8Array) {
    this._nonce = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    MessageResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): MessageResponse.AsObject {
    return {
      messageId: this.messageId,
      senderId: this.senderId,
      recipientId: this.recipientId,
      encryptedPayload: this.encryptedPayload
        ? this.encryptedPayload.subarray(0)
        : new Uint8Array(),
      timestamp: this.timestamp,
      nonce: this.nonce ? this.nonce.subarray(0) : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): MessageResponse.AsProtobufJSON {
    return {
      messageId: this.messageId,
      senderId: this.senderId,
      recipientId: this.recipientId,
      encryptedPayload: this.encryptedPayload
        ? uint8ArrayToBase64(this.encryptedPayload)
        : '',
      timestamp: this.timestamp,
      nonce: this.nonce ? uint8ArrayToBase64(this.nonce) : ''
    };
  }
}
export module MessageResponse {
  /**
   * Standard JavaScript object representation for MessageResponse
   */
  export interface AsObject {
    messageId: string;
    senderId: string;
    recipientId: string;
    encryptedPayload: Uint8Array;
    timestamp: string;
    nonce: Uint8Array;
  }

  /**
   * Protobuf JSON representation for MessageResponse
   */
  export interface AsProtobufJSON {
    messageId: string;
    senderId: string;
    recipientId: string;
    encryptedPayload: string;
    timestamp: string;
    nonce: string;
  }
}

/**
 * Message implementation for chat.KeyRequest
 */
export class KeyRequest implements GrpcMessage {
  static id = 'chat.KeyRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new KeyRequest();
    KeyRequest.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: KeyRequest) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.recipientId = _instance.recipientId || '';
    _instance.keyMaterial = _instance.keyMaterial || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: KeyRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.recipientId = _reader.readString();
          break;
        case 3:
          _instance.keyMaterial = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    KeyRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: KeyRequest, _writer: BinaryWriter) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.recipientId) {
      _writer.writeString(2, _instance.recipientId);
    }
    if (_instance.keyMaterial && _instance.keyMaterial.length) {
      _writer.writeBytes(3, _instance.keyMaterial);
    }
  }

  private _sessionId: string;
  private _recipientId: string;
  private _keyMaterial: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of KeyRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<KeyRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.recipientId = _value.recipientId;
    this.keyMaterial = _value.keyMaterial;
    KeyRequest.refineValues(this);
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }
  get recipientId(): string {
    return this._recipientId;
  }
  set recipientId(value: string) {
    this._recipientId = value;
  }
  get keyMaterial(): Uint8Array {
    return this._keyMaterial;
  }
  set keyMaterial(value: Uint8Array) {
    this._keyMaterial = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    KeyRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): KeyRequest.AsObject {
    return {
      sessionId: this.sessionId,
      recipientId: this.recipientId,
      keyMaterial: this.keyMaterial
        ? this.keyMaterial.subarray(0)
        : new Uint8Array()
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): KeyRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      recipientId: this.recipientId,
      keyMaterial: this.keyMaterial ? uint8ArrayToBase64(this.keyMaterial) : ''
    };
  }
}
export module KeyRequest {
  /**
   * Standard JavaScript object representation for KeyRequest
   */
  export interface AsObject {
    sessionId: string;
    recipientId: string;
    keyMaterial: Uint8Array;
  }

  /**
   * Protobuf JSON representation for KeyRequest
   */
  export interface AsProtobufJSON {
    sessionId: string;
    recipientId: string;
    keyMaterial: string;
  }
}

/**
 * Message implementation for chat.KeyResponse
 */
export class KeyResponse implements GrpcMessage {
  static id = 'chat.KeyResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new KeyResponse();
    KeyResponse.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: KeyResponse) {
    _instance.success = _instance.success || false;
    _instance.errorMessage = _instance.errorMessage || '';
    _instance.keyMaterial = _instance.keyMaterial || new Uint8Array();
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: KeyResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.success = _reader.readBool();
          break;
        case 2:
          _instance.errorMessage = _reader.readString();
          break;
        case 3:
          _instance.keyMaterial = _reader.readBytes();
          break;
        case 4:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    KeyResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: KeyResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.success) {
      _writer.writeBool(1, _instance.success);
    }
    if (_instance.errorMessage) {
      _writer.writeString(2, _instance.errorMessage);
    }
    if (_instance.keyMaterial && _instance.keyMaterial.length) {
      _writer.writeBytes(3, _instance.keyMaterial);
    }
    if (_instance.sessionId) {
      _writer.writeString(4, _instance.sessionId);
    }
  }

  private _success: boolean;
  private _errorMessage: string;
  private _keyMaterial: Uint8Array;
  private _sessionId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of KeyResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<KeyResponse.AsObject>) {
    _value = _value || {};
    this.success = _value.success;
    this.errorMessage = _value.errorMessage;
    this.keyMaterial = _value.keyMaterial;
    this.sessionId = _value.sessionId;
    KeyResponse.refineValues(this);
  }
  get success(): boolean {
    return this._success;
  }
  set success(value: boolean) {
    this._success = value;
  }
  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
  }
  get keyMaterial(): Uint8Array {
    return this._keyMaterial;
  }
  set keyMaterial(value: Uint8Array) {
    this._keyMaterial = value;
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    KeyResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): KeyResponse.AsObject {
    return {
      success: this.success,
      errorMessage: this.errorMessage,
      keyMaterial: this.keyMaterial
        ? this.keyMaterial.subarray(0)
        : new Uint8Array(),
      sessionId: this.sessionId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): KeyResponse.AsProtobufJSON {
    return {
      success: this.success,
      errorMessage: this.errorMessage,
      keyMaterial: this.keyMaterial ? uint8ArrayToBase64(this.keyMaterial) : '',
      sessionId: this.sessionId
    };
  }
}
export module KeyResponse {
  /**
   * Standard JavaScript object representation for KeyResponse
   */
  export interface AsObject {
    success: boolean;
    errorMessage: string;
    keyMaterial: Uint8Array;
    sessionId: string;
  }

  /**
   * Protobuf JSON representation for KeyResponse
   */
  export interface AsProtobufJSON {
    success: boolean;
    errorMessage: string;
    keyMaterial: string;
    sessionId: string;
  }
}
