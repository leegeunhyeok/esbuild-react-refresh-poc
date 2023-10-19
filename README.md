# esbuild-react-refresh-poc

## react-refresh

This is component module. It should be registered in the `react-refresh` context for fast refresh.

```ts
import React from 'react';

export function Component(): JSX.Element {
  //...
}
```

Usually, this is transformed via a babel plugin(`react-refresh/babel`) as follows.

```js
var _s = $RefreshSig$();
import { useState } from 'react';

function Component() {
  _s();
  // ...
}

_s(Component, 'oDgYfYHkD9Wkv4hrAPCkI/ev3YU=');
_c = Component;
var _c;
$RefreshReg$(_c, 'Component');
```

What is `$RefreshSig$` and `$RefreshReg$`?

In [gaearon's comment](https://github.com/facebook/react/issues/16604#issuecomment-528663101), this is part of `react-refresh/runtime`.

```js
var RefreshRuntime = require('react-refresh/runtime');

globalThis.$RefreshReg$ = (type, id) => {
  // Note module.id is webpack-specific, this may vary in other bundlers
  const fullId = module.id + ' ' + id;
  RefreshRuntime.register(type, fullId);
}
globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
```

It means, you should inject `$RefreshSig$` and `$RefreshReg$` before run your code.

```js
// top of your code
const runtime = require('react-refresh/runtime');
runtime.injectIntoGlobalHook(globalThis);
globalThis.$RefreshReg$ = () => {};
globalThis.$RefreshSig$ = () => type => type;
```

and then wrap each module with the template below.

```js
var prevRefreshReg = globalThis.$RefreshReg$;
var prevRefreshSig = globalThis.$RefreshSig$;
var refreshRuntime = require('react-refresh/runtime');

globalThis.$RefreshReg$ = (type, id) => {
  // Note module.id is webpack-specific, this may vary in other bundlers
  const fullId = module.id + ' ' + id;
  refreshRuntime.register(type, fullId);
}
globalThis.$RefreshSig$ = refreshRuntime.createSignatureFunctionForTransform;

try {
  var signature = globalThis.$RefreshSig$();

  // Actual module code here
  function Component() {
    // Call without arguments triggers collecting the custom Hook list.
    // Next calls are noops.
    signature();
    // ...
  }

  // Call with arguments attaches the signature to the type.
  signature(Component, 'oDgYfYHkD9Wkv4hrAPCkI/ev3YU=');
  globalThis.$RefreshReg$(Component, 'Component');

  // Performing refresh.
  // Pass updatedFamilies(re-render with keep states), staleFamilies(re-mount) to reconciler and
  // will be called scheduleFibersWithFamiliesRecursively() in sync lane(flushSync).
  refreshRuntime.performReactRefresh(); // To avoid duplicate calls, debounce it.
} finally {
  globalThis.$RefreshReg$ = prevRefreshReg;
  globalThis.$RefreshSig$ = prevRefreshSig;
}
```

After component changed, re-build component and send to client with same template and evaluate it.

- Same signature: will be re-rendered.
- Different signature: will be re-mounted.
