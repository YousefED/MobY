deprecated: moved to [@reactivedata/yjs-reactive-bindings](https://www.npmjs.com/package/@reactivedata/yjs-reactive-bindings).

# MobY: MobX bindings for Yjs

Experimental bridge between MobX and Yjs. [Demo + Playground on CodeSandbox](https://codesandbox.io/s/moby-demo-yn42g?file=/src/App.tsx).

## What does this solve?

Although Yjs is great for data syncing, observing changes to your data model can be quite cumbersome. You'd need to manually call `observe` to keep updated of (incoming) changes and keep the rest of your application in sync.

MobY brings the reactive data model of MobX to Yjs. Combine best of both worlds:

- Yjs: great for data syncing
- MobX: great for developing applications that automatically react to state changes

## Cool, how does it work?

Set up your yJS document (same as plain-yJS):

```
const ydoc = new Y.Doc();
const provider = new WebrtcProvider("doc", ydoc);
```

Call observeYJS to patch the document. From now on, `ydoc` will be compatible with MobX observers:

```
observeYJS(ydoc);
```

Use the Yjs document somewhere in an observer, for example using MobX `autorun`:

```
autorun(() => {
    console.log(ydoc.getMap("data").get("magicnumber")); // automatically log the Yjs value once it's updated
})
```

Or use mobx-react-lite to automatically rerender your React components.

## Demo?

[Playground on CodeSandbox](https://codesandbox.io/s/moby-demo-yn42g?file=/src/App.tsx). Open multiple windows and click the button to see the magic.
