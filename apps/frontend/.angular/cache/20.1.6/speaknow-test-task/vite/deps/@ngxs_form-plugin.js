import {
  Actions,
  Store,
  getActionTypeFromInstance,
  getValue,
  ofActionDispatched,
  setValue,
  takeUntilDestroyed,
  withNgxsPlugin
} from "./chunk-ER2PCLZP.js";
import {
  FormGroupDirective
} from "./chunk-LJUEVCKN.js";
import "./chunk-4G7JAX4I.js";
import "./chunk-ZH6LALFQ.js";
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Injectable,
  Input,
  NgModule,
  inject,
  setClassMetadata,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-WNUGN5DN.js";
import {
  debounceTime,
  distinctUntilChanged
} from "./chunk-MDWNBTJR.js";
import "./chunk-6KNO4II2.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ngxs/form-plugin/fesm2022/ngxs-form-plugin.mjs
var UpdateFormStatus = class {
  payload;
  static type = "[Forms] Update Form Status";
  constructor(payload) {
    this.payload = payload;
  }
};
var UpdateFormValue = class {
  payload;
  static type = "[Forms] Update Form Value";
  constructor(payload) {
    this.payload = payload;
  }
};
var UpdateForm = class {
  payload;
  static type = "[Forms] Update Form";
  constructor(payload) {
    this.payload = payload;
  }
};
var UpdateFormDirty = class {
  payload;
  static type = "[Forms] Update Form Dirty";
  constructor(payload) {
    this.payload = payload;
  }
};
var SetFormDirty = class {
  payload;
  static type = "[Forms] Set Form Dirty";
  constructor(payload) {
    this.payload = payload;
  }
};
var SetFormPristine = class {
  payload;
  static type = "[Forms] Set Form Pristine";
  constructor(payload) {
    this.payload = payload;
  }
};
var UpdateFormErrors = class {
  payload;
  static type = "[Forms] Update Form Errors";
  constructor(payload) {
    this.payload = payload;
  }
};
var SetFormDisabled = class {
  payload;
  static type = "[Forms] Set Form Disabled";
  constructor(payload) {
    this.payload = payload;
  }
};
var SetFormEnabled = class {
  payload;
  static type = "[Forms] Set Form Enabled";
  constructor(payload) {
    this.payload = payload;
  }
};
var ResetForm = class {
  payload;
  static type = "[Forms] Reset Form";
  constructor(payload) {
    this.payload = payload;
  }
};
var NgxsFormPlugin = class _NgxsFormPlugin {
  handle(state, event, next) {
    const type = getActionTypeFromInstance(event);
    let nextState = state;
    if (type === UpdateFormValue.type || type === UpdateForm.type || type === ResetForm.type) {
      const {
        value
      } = event.payload;
      const payloadValue = Array.isArray(value) ? value.slice() : isObjectLike(value) ? __spreadValues({}, value) : value;
      const path = this.joinPathWithPropertyPath(event);
      nextState = setValue(nextState, path, payloadValue);
    }
    if (type === ResetForm.type) {
      const model = getValue(nextState, `${event.payload.path}.model`);
      nextState = setValue(nextState, `${event.payload.path}`, {
        model
      });
    }
    if (type === UpdateFormStatus.type || type === UpdateForm.type) {
      nextState = setValue(nextState, `${event.payload.path}.status`, event.payload.status);
    }
    if (type === UpdateFormErrors.type || type === UpdateForm.type) {
      nextState = setValue(nextState, `${event.payload.path}.errors`, __spreadValues({}, event.payload.errors));
    }
    if (type === UpdateFormDirty.type || type === UpdateForm.type) {
      nextState = setValue(nextState, `${event.payload.path}.dirty`, event.payload.dirty);
    }
    if (type === SetFormDirty.type) {
      nextState = setValue(nextState, `${event.payload}.dirty`, true);
    }
    if (type === SetFormPristine.type) {
      nextState = setValue(nextState, `${event.payload}.dirty`, false);
    }
    if (type === SetFormDisabled.type) {
      nextState = setValue(nextState, `${event.payload}.disabled`, true);
    }
    if (type === SetFormEnabled.type) {
      nextState = setValue(nextState, `${event.payload}.disabled`, false);
    }
    return next(nextState, event);
  }
  joinPathWithPropertyPath({
    payload
  }) {
    let path = `${payload.path}.model`;
    if (payload.propertyPath) {
      path += `.${payload.propertyPath}`;
    }
    return path;
  }
  /** @nocollapse */
  static ɵfac = function NgxsFormPlugin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsFormPlugin)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NgxsFormPlugin,
    factory: _NgxsFormPlugin.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsFormPlugin, [{
    type: Injectable
  }], null, null);
})();
function isObjectLike(target) {
  return target !== null && typeof target === "object";
}
var NgxsFormDirective = class _NgxsFormDirective {
  path = null;
  set debounce(debounce) {
    this._debounce = Number(debounce);
  }
  get debounce() {
    return this._debounce;
  }
  _debounce = 100;
  set clearDestroy(val) {
    this._clearDestroy = val != null && `${val}` !== "false";
  }
  get clearDestroy() {
    return this._clearDestroy;
  }
  _clearDestroy = false;
  _updating = false;
  _actions$ = inject(Actions);
  _store = inject(Store);
  _formGroupDirective = inject(FormGroupDirective);
  _cd = inject(ChangeDetectorRef);
  _destroyRef = inject(DestroyRef);
  constructor() {
    this._destroyRef.onDestroy(() => {
      if (this.clearDestroy) {
        this._store.dispatch(new UpdateForm({
          path: this.path,
          value: null,
          dirty: null,
          status: null,
          errors: null
        }));
      }
    });
  }
  ngOnInit() {
    const resetForm$ = this._actions$.pipe(ofActionDispatched(ResetForm), takeUntilDestroyed(this._destroyRef));
    resetForm$.subscribe((action) => {
      if (action.payload.path !== this.path) {
        return;
      }
      this.form.reset(action.payload.value);
      this.updateFormStateWithRawValue(true);
      this._cd.markForCheck();
    });
    this.getStateStream(`${this.path}.model`).subscribe((model) => {
      if (this._updating || !model) {
        return;
      }
      this.form.patchValue(model);
      this._cd.markForCheck();
    });
    this.getStateStream(`${this.path}.dirty`).subscribe((dirty) => {
      if (this.form.dirty === dirty || typeof dirty !== "boolean") {
        return;
      }
      if (dirty) {
        this.form.markAsDirty();
      } else {
        this.form.markAsPristine();
      }
      this._cd.markForCheck();
    });
    this._store.selectOnce((state) => getValue(state, this.path)).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._store.dispatch([new UpdateFormValue({
        path: this.path,
        value: this.form.getRawValue()
      }), new UpdateFormStatus({
        path: this.path,
        status: this.form.status
      }), new UpdateFormDirty({
        path: this.path,
        dirty: this.form.dirty
      })]);
    });
    this.getStateStream(`${this.path}.disabled`).subscribe((disabled) => {
      if (this.form.disabled === disabled || typeof disabled !== "boolean") {
        return;
      }
      if (disabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
      this._cd.markForCheck();
    });
    this._formGroupDirective.valueChanges.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)), this.debounceChange()).subscribe(() => {
      this.updateFormStateWithRawValue();
    });
    this._formGroupDirective.statusChanges.pipe(distinctUntilChanged(), this.debounceChange()).subscribe((status) => {
      this._store.dispatch(new UpdateFormStatus({
        status,
        path: this.path
      }));
    });
  }
  updateFormStateWithRawValue(withFormStatus) {
    if (this._updating) return;
    const value = this._formGroupDirective.control.getRawValue();
    const actions = [new UpdateFormValue({
      path: this.path,
      value
    }), new UpdateFormDirty({
      path: this.path,
      dirty: this._formGroupDirective.dirty
    }), new UpdateFormErrors({
      path: this.path,
      errors: this._formGroupDirective.errors
    })];
    if (withFormStatus) {
      actions.push(new UpdateFormStatus({
        path: this.path,
        status: this._formGroupDirective.status
      }));
    }
    this._updating = true;
    this._store.dispatch(actions).subscribe({
      error: () => this._updating = false,
      complete: () => this._updating = false
    });
  }
  debounceChange() {
    const skipDebounceTime = this._formGroupDirective.control.updateOn !== "change" || this._debounce < 0;
    return skipDebounceTime ? (change) => change.pipe(takeUntilDestroyed(this._destroyRef)) : (change) => change.pipe(debounceTime(this._debounce), takeUntilDestroyed(this._destroyRef));
  }
  get form() {
    return this._formGroupDirective.form;
  }
  getStateStream(path) {
    return this._store.select((state) => getValue(state, path)).pipe(takeUntilDestroyed(this._destroyRef));
  }
  /** @nocollapse */
  static ɵfac = function NgxsFormDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsFormDirective)();
  };
  /** @nocollapse */
  static ɵdir = ɵɵdefineDirective({
    type: _NgxsFormDirective,
    selectors: [["", "ngxsForm", ""]],
    inputs: {
      path: [0, "ngxsForm", "path"],
      debounce: [0, "ngxsFormDebounce", "debounce"],
      clearDestroy: [0, "ngxsFormClearOnDestroy", "clearDestroy"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsFormDirective, [{
    type: Directive,
    args: [{
      selector: "[ngxsForm]",
      standalone: true
    }]
  }], () => [], {
    path: [{
      type: Input,
      args: ["ngxsForm"]
    }],
    debounce: [{
      type: Input,
      args: ["ngxsFormDebounce"]
    }],
    clearDestroy: [{
      type: Input,
      args: ["ngxsFormClearOnDestroy"]
    }]
  });
})();
var NgxsFormPluginModule = class _NgxsFormPluginModule {
  static forRoot() {
    return {
      ngModule: _NgxsFormPluginModule,
      providers: [withNgxsPlugin(NgxsFormPlugin)]
    };
  }
  /** @nocollapse */
  static ɵfac = function NgxsFormPluginModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsFormPluginModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsFormPluginModule,
    imports: [NgxsFormDirective],
    exports: [NgxsFormDirective]
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsFormPluginModule, [{
    type: NgModule,
    args: [{
      imports: [NgxsFormDirective],
      exports: [NgxsFormDirective]
    }]
  }], null, null);
})();
function withNgxsFormPlugin() {
  return withNgxsPlugin(NgxsFormPlugin);
}
export {
  NgxsFormDirective,
  NgxsFormPlugin,
  NgxsFormPluginModule,
  ResetForm,
  SetFormDirty,
  SetFormDisabled,
  SetFormEnabled,
  SetFormPristine,
  UpdateForm,
  UpdateFormDirty,
  UpdateFormErrors,
  UpdateFormStatus,
  UpdateFormValue,
  withNgxsFormPlugin
};
//# sourceMappingURL=@ngxs_form-plugin.js.map
