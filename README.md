# store-ts

![storeTs](media/store.png)

## Install

```bash
npm install @emit-js/emit @emit-js/store
```

## Setup

```js
import { Emit } from "@emit-js/emit"
import { store } from "@emit-js/store"

const emit = new Emit()
store(emit)
```

## Usage

```js
emit.set(["hello", "world"], true)
emit.get() // { hello: { world: true } }
emit.get("hello") // { world: true }
emit.get(["hello", "world"]) // true
emit.merge("hello", { universe: true })
emit.get() // { hello: { universe: true, world: true } }
```
