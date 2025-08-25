import {
  InitState,
  Store,
  getActionTypeFromInstance,
  withNgxsPlugin
} from "./chunk-ER2PCLZP.js";
import {
  DestroyRef,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  _global,
  inject,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-WNUGN5DN.js";
import {
  catchError,
  tap
} from "./chunk-MDWNBTJR.js";
import "./chunk-6KNO4II2.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ngxs/devtools-plugin/fesm2022/ngxs-devtools-plugin.mjs
var NGXS_DEVTOOLS_OPTIONS = new InjectionToken("NGXS_DEVTOOLS_OPTIONS");
var ReduxDevtoolsActionType;
(function(ReduxDevtoolsActionType2) {
  ReduxDevtoolsActionType2["Dispatch"] = "DISPATCH";
  ReduxDevtoolsActionType2["Action"] = "ACTION";
})(ReduxDevtoolsActionType || (ReduxDevtoolsActionType = {}));
var ReduxDevtoolsPayloadType;
(function(ReduxDevtoolsPayloadType2) {
  ReduxDevtoolsPayloadType2["JumpToAction"] = "JUMP_TO_ACTION";
  ReduxDevtoolsPayloadType2["JumpToState"] = "JUMP_TO_STATE";
  ReduxDevtoolsPayloadType2["ToggleAction"] = "TOGGLE_ACTION";
  ReduxDevtoolsPayloadType2["ImportState"] = "IMPORT_STATE";
})(ReduxDevtoolsPayloadType || (ReduxDevtoolsPayloadType = {}));
var NgxsReduxDevtoolsPlugin = class _NgxsReduxDevtoolsPlugin {
  _injector = inject(Injector);
  _ngZone = inject(NgZone);
  _options = inject(NGXS_DEVTOOLS_OPTIONS);
  devtoolsExtension = null;
  globalDevtools = _global["__REDUX_DEVTOOLS_EXTENSION__"] || _global["devToolsExtension"];
  unsubscribe = null;
  constructor() {
    this.connect();
    inject(DestroyRef).onDestroy(() => {
      this.unsubscribe?.();
      this.globalDevtools?.disconnect();
    });
  }
  /**
   * Lazy get the store for circular dependency issues
   */
  get store() {
    return this._injector.get(Store);
  }
  /**
   * Middleware handle function
   */
  handle(state, action, next) {
    if (!this.devtoolsExtension || this._options.disabled) {
      return next(state, action);
    }
    return next(state, action).pipe(catchError((error) => {
      const newState = this.store.snapshot();
      this.sendToDevTools(state, action, newState);
      throw error;
    }), tap((newState) => {
      this.sendToDevTools(state, action, newState);
    }));
  }
  sendToDevTools(state, action, newState) {
    const type = getActionTypeFromInstance(action);
    const isInitAction = type === InitState.type;
    if (isInitAction) {
      this.devtoolsExtension.init(state);
    } else {
      this.devtoolsExtension.send(__spreadProps(__spreadValues({}, action), {
        action: null,
        type
      }), newState);
    }
  }
  /**
   * Handle the action from the dev tools subscription
   */
  dispatched(action) {
    if (action.type === ReduxDevtoolsActionType.Dispatch) {
      if (action.payload.type === ReduxDevtoolsPayloadType.JumpToAction || action.payload.type === ReduxDevtoolsPayloadType.JumpToState) {
        const prevState = JSON.parse(action.state);
        if (prevState.router?.trigger) {
          prevState.router.trigger = "devtools";
        }
        this.store.reset(prevState);
      } else if (action.payload.type === ReduxDevtoolsPayloadType.ToggleAction) {
        console.warn("Skip is not supported at this time.");
      } else if (action.payload.type === ReduxDevtoolsPayloadType.ImportState) {
        const {
          actionsById,
          computedStates,
          currentStateIndex
        } = action.payload.nextLiftedState;
        this.devtoolsExtension.init(computedStates[0].state);
        Object.keys(actionsById).filter((actionId) => actionId !== "0").forEach((actionId) => this.devtoolsExtension.send(actionsById[actionId], computedStates[actionId].state));
        this.store.reset(computedStates[currentStateIndex].state);
      }
    } else if (action.type === ReduxDevtoolsActionType.Action) {
      const actionPayload = JSON.parse(action.payload);
      this.store.dispatch(actionPayload);
    }
  }
  connect() {
    if (!this.globalDevtools || this._options.disabled) {
      return;
    }
    this.devtoolsExtension = this._ngZone.runOutsideAngular(() => this.globalDevtools.connect(this._options));
    this.unsubscribe = this.devtoolsExtension.subscribe((action) => {
      if (action.type === ReduxDevtoolsActionType.Dispatch || action.type === ReduxDevtoolsActionType.Action) {
        this.dispatched(action);
      }
    });
  }
  /** @nocollapse */
  static ɵfac = function NgxsReduxDevtoolsPlugin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsReduxDevtoolsPlugin)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NgxsReduxDevtoolsPlugin,
    factory: _NgxsReduxDevtoolsPlugin.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsReduxDevtoolsPlugin, [{
    type: Injectable
  }], () => [], null);
})();
function devtoolsOptionsFactory(options) {
  return __spreadValues({
    name: "NGXS"
  }, options);
}
var USER_OPTIONS = new InjectionToken("USER_OPTIONS");
var NgxsReduxDevtoolsPluginModule = class _NgxsReduxDevtoolsPluginModule {
  static forRoot(options) {
    return {
      ngModule: _NgxsReduxDevtoolsPluginModule,
      providers: [withNgxsPlugin(NgxsReduxDevtoolsPlugin), {
        provide: USER_OPTIONS,
        useValue: options
      }, {
        provide: NGXS_DEVTOOLS_OPTIONS,
        useFactory: devtoolsOptionsFactory,
        deps: [USER_OPTIONS]
      }]
    };
  }
  /** @nocollapse */
  static ɵfac = function NgxsReduxDevtoolsPluginModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsReduxDevtoolsPluginModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsReduxDevtoolsPluginModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsReduxDevtoolsPluginModule, [{
    type: NgModule
  }], null, null);
})();
function withNgxsReduxDevtoolsPlugin(options) {
  return makeEnvironmentProviders([withNgxsPlugin(NgxsReduxDevtoolsPlugin), {
    provide: USER_OPTIONS,
    useValue: options
  }, {
    provide: NGXS_DEVTOOLS_OPTIONS,
    useFactory: devtoolsOptionsFactory,
    deps: [USER_OPTIONS]
  }]);
}
export {
  NGXS_DEVTOOLS_OPTIONS,
  NgxsReduxDevtoolsPlugin,
  NgxsReduxDevtoolsPluginModule,
  withNgxsReduxDevtoolsPlugin
};
//# sourceMappingURL=@ngxs_devtools-plugin.js.map
