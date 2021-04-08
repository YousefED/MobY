import * as Y from "yjs";
import { observeYJS } from ".";

const docsObserved = new WeakSet<Y.Doc>();

export function observeDoc(doc: Y.Doc) {
  if (docsObserved.has(doc)) {
    // already patched
    return doc;
  }
  docsObserved.add(doc);

  const originalGet = doc.get;

  doc.get = function (key: string) {
    if (typeof key !== "string") {
      throw new Error("unexpected");
    }
    const ret = Reflect.apply(originalGet, this, arguments);
    if (!ret) {
      return ret;
    }
    if (ret instanceof Y.AbstractType) {
      return observeYJS(ret);
    }
    return ret;
  };

  return doc;
}
