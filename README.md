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
    // ...
  }

  signature(Component, 'oDgYfYHkD9Wkv4hrAPCkI/ev3YU=');
  globalThis.$RefreshReg$(Component, 'Component');
} finally {
  globalThis.$RefreshReg$ = prevRefreshReg;
  globalThis.$RefreshSig$ = prevRefreshSig;
}
```
