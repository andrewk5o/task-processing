import {
  Actions,
  Store,
  getValue,
  ofActionDispatched,
  takeUntilDestroyed
} from "./chunk-ER2PCLZP.js";
import {
  APP_INITIALIZER,
  DestroyRef,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  inject,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-WNUGN5DN.js";
import {
  Subject,
  fromEvent,
  takeUntil
} from "./chunk-MDWNBTJR.js";
import "./chunk-6KNO4II2.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ngxs/websocket-plugin/fesm2022/ngxs-websocket-plugin.mjs
var NGXS_WEBSOCKET_OPTIONS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_WEBSOCKET_OPTIONS" : "");
var USER_OPTIONS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "USER_OPTIONS" : "");
var ConnectWebSocket = class {
  payload;
  static type = "[WebSocket] Connect";
  constructor(payload) {
    this.payload = payload;
  }
};
var WebSocketMessageError = class {
  payload;
  static type = "[WebSocket] Message Error";
  constructor(payload) {
    this.payload = payload;
  }
};
var DisconnectWebSocket = class {
  static type = "[WebSocket] Disconnect";
};
var WebSocketConnected = class {
  static type = "[WebSocket] Connected";
};
var WebSocketDisconnected = class {
  static type = "[WebSocket] Disconnected";
};
var SendWebSocketMessage = class {
  payload;
  static type = "[WebSocket] Send Message";
  constructor(payload) {
    this.payload = payload;
  }
};
var WebSocketConnectionUpdated = class {
  static type = "[WebSocket] Connection Updated";
};
var TypeKeyPropertyMissingError = class extends Error {
  constructor(typeKey) {
    super(`Property ${typeKey} is missing on the socket message`);
  }
};
var WebSocketHandler = class _WebSocketHandler {
  _store = inject(Store);
  _ngZone = inject(NgZone);
  _actions$ = inject(Actions);
  _options = inject(NGXS_WEBSOCKET_OPTIONS);
  _socket = null;
  _socketClosed$ = new Subject();
  _typeKey = this._options.typeKey;
  _destroyRef = inject(DestroyRef);
  constructor() {
    this._setupActionsListeners();
    this._destroyRef.onDestroy(() => this._closeConnection(
      /* forcelyCloseSocket */
      true
    ));
  }
  _setupActionsListeners() {
    this._actions$.pipe(ofActionDispatched(ConnectWebSocket), takeUntilDestroyed(this._destroyRef)).subscribe(({
      payload
    }) => {
      this.connect(payload);
    });
    this._actions$.pipe(ofActionDispatched(DisconnectWebSocket), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._disconnect(
        /* forcelyCloseSocket */
        true
      );
    });
    this._actions$.pipe(ofActionDispatched(SendWebSocketMessage), takeUntilDestroyed(this._destroyRef)).subscribe(({
      payload
    }) => {
      this.send(payload);
    });
  }
  connect(options) {
    if (this._socket) {
      this._closeConnection(
        /* forcelyCloseSocket */
        true
      );
      this._store.dispatch(new WebSocketConnectionUpdated());
    }
    if (options) {
      if (options.serializer) {
        this._options.serializer = options.serializer;
      }
      if (options.deserializer) {
        this._options.deserializer = options.deserializer;
      }
    }
    this._ngZone.runOutsideAngular(() => {
      const url = options?.url || this._options.url;
      const protocol = options?.protocol || this._options.protocol;
      const binaryType = options?.binaryType || this._options.binaryType;
      const socket = this._socket = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
      if (binaryType) {
        socket.binaryType = binaryType;
      }
      fromEvent(socket, "open").pipe(takeUntil(this._socketClosed$)).subscribe(() => this._store.dispatch(new WebSocketConnected()));
      fromEvent(socket, "message").pipe(takeUntil(this._socketClosed$)).subscribe((event) => {
        const message = this._options.deserializer(event);
        const type = getValue(message, this._typeKey);
        if (!type) {
          throw new TypeKeyPropertyMissingError(this._typeKey);
        }
        this._store.dispatch(__spreadProps(__spreadValues({}, message), {
          type
        }));
      });
      fromEvent(socket, "error").pipe(takeUntil(this._socketClosed$)).subscribe((error) => {
        this._disconnect(
          /* forcelyCloseSocket */
          true
        );
        this._store.dispatch(new WebSocketMessageError(error));
      });
      fromEvent(socket, "close").pipe(takeUntil(this._socketClosed$)).subscribe((event) => {
        if (event.wasClean) {
          this._disconnect(
            /* forcelyCloseSocket */
            false
          );
        } else {
          this._disconnect(
            /* forcelyCloseSocket */
            true
          );
          this._store.dispatch(new WebSocketMessageError(event));
        }
      });
    });
  }
  _disconnect(forcelyCloseSocket) {
    if (this._socket) {
      this._closeConnection(forcelyCloseSocket);
      this._store.dispatch(new WebSocketDisconnected());
    }
  }
  send(data) {
    if (!this._socket) {
      throw new Error("You must connect to the socket before sending any data");
    }
    try {
      this._socket.send(this._options.serializer(data));
    } catch (error) {
      this._store.dispatch(new WebSocketMessageError(error));
    }
  }
  _closeConnection(forcelyCloseSocket) {
    if (forcelyCloseSocket) {
      this._socket?.close();
    }
    this._socket = null;
    this._socketClosed$.next();
  }
  /** @nocollapse */
  static ɵfac = function WebSocketHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WebSocketHandler)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _WebSocketHandler,
    factory: _WebSocketHandler.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WebSocketHandler, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function ɵwebsocketOptionsFactory(options) {
  return __spreadValues({
    reconnectInterval: 5e3,
    reconnectAttempts: 10,
    typeKey: "type",
    deserializer(e) {
      return JSON.parse(e.data);
    },
    serializer(value) {
      return JSON.stringify(value);
    }
  }, options);
}
function ɵgetProviders(options) {
  return [{
    provide: USER_OPTIONS,
    useValue: options
  }, {
    provide: NGXS_WEBSOCKET_OPTIONS,
    useFactory: ɵwebsocketOptionsFactory,
    deps: [USER_OPTIONS]
  }, {
    provide: APP_INITIALIZER,
    useFactory: () => () => {
    },
    deps: [WebSocketHandler],
    multi: true
  }];
}
var NgxsWebSocketPluginModule = class _NgxsWebSocketPluginModule {
  static forRoot(options) {
    return {
      ngModule: _NgxsWebSocketPluginModule,
      providers: ɵgetProviders(options)
    };
  }
  /** @nocollapse */
  static ɵfac = function NgxsWebSocketPluginModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsWebSocketPluginModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsWebSocketPluginModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsWebSocketPluginModule, [{
    type: NgModule
  }], null, null);
})();
function withNgxsWebSocketPlugin(options) {
  return makeEnvironmentProviders(ɵgetProviders(options));
}
export {
  ConnectWebSocket,
  DisconnectWebSocket,
  NgxsWebSocketPluginModule,
  SendWebSocketMessage,
  WebSocketConnected,
  WebSocketConnectionUpdated,
  WebSocketDisconnected,
  WebSocketMessageError,
  withNgxsWebSocketPlugin,
  NGXS_WEBSOCKET_OPTIONS as ɵNGXS_WEBSOCKET_OPTIONS
};
//# sourceMappingURL=@ngxs_websocket-plugin.js.map
