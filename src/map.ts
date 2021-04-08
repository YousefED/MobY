import { createAtom, IAtom } from "mobx";
import * as Y from "yjs";
import { observeYJS } from ".";

const mapsObserved = new WeakSet<Y.Map<any>>();

export function observeMap(map: Y.Map<any>) {
  if (mapsObserved.has(map)) {
    // already patched
    return map;
  }
  mapsObserved.add(map);
  let selfAtom: IAtom | undefined;
  const atoms = new Map<string, IAtom>();

  function reportSelfAtom() {
    if (!selfAtom) {
      const handler = (_changes: Y.YMapEvent<any>) => {
        selfAtom!.reportChanged();
      };
      selfAtom = createAtom(
        "map",
        () => {
          map.observe(handler);
        },
        () => {
          map.unobserve(handler);
        }
      );
    }
  }

  function reportMapKeyAtom(key: string) {
    let atom = atoms.get(key);

    // possible optimization: only register a single handler for all keys
    if (!atom) {
      const handler = (changes: Y.YMapEvent<any>) => {
        if (changes.keysChanged.has(key)) {
          atom!.reportChanged();
        }
      };
      atom = createAtom(
        key,
        () => {
          map.observe(handler);
        },
        () => {
          map.unobserve(handler);
        }
      );
      atoms.set(key, atom);
    }

    atom.reportObserved();
  }

  const originalGet = map.get;

  map.get = function (key: string) {
    if (typeof key !== "string") {
      throw new Error("unexpected");
    }
    reportMapKeyAtom(key);
    const ret = Reflect.apply(originalGet, this, arguments);
    if (!ret) {
      return ret;
    }
    if (ret instanceof Y.AbstractType) {
      return observeYJS(ret);
    }
    return ret;
  };

  const originalValues = map.values;
  map.values = function () {
    reportSelfAtom();
    const ret = Reflect.apply(originalValues, this, arguments);
    return ret;
  };

  return map;
}
