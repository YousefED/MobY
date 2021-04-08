import * as Y from "yjs";
import { observeDoc } from "./doc";
import { observeMap } from "./map";
import { observeText } from "./text";

export function observeYJS(element: Y.AbstractType<any>) {
  if (element instanceof Y.Text) {
    return observeText(element);
  } else if (element instanceof Y.Array) {
  } else if (element instanceof Y.Map) {
    return observeMap(element);
  } else if (Object.prototype.hasOwnProperty.call(element, "autoLoad")) {
    // subdoc. Ok way to detect this?
    return observeDoc((element as any) as Y.Doc);
  } else {
    throw new Error("not yet supported");
  }
}

export { observeText, observeMap, observeDoc };
