import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {ImmerCtx} from "./Context";

export function useBodyAttributes(data) {
  // TODO: useDeepCompareEffect(..., [data]) is probably what we really want
  useEffect(() => {
    let orig = document.body.attributes;

    for (const cls of Object.keys(data)) {
      document.body.setAttribute(cls, data[cls]);
    }

    return () => {
      for (const cls of Object.keys(data)) {
        document.body.removeAttribute(cls);
      }
      // Needed to restore any keys in `data` that we overrode
      for (const attr of orig) {
        document.body.attributes.setNamedItem(attr);
      }
    }
  })
}

/**
 * @template T
 * @param {T} init
 * @return ImmerCtx<T>
 */
export function useImmerCtx(init) {
  let [ctx, setCtx] = useState(new ImmerCtx(init));
  ctx.updater = setCtx;
  return ctx;
}

export function Stylesheet({ url }) {
  return createPortal(<link rel="stylesheet" href={url} />, document.head);
}

export function Icon({ name, style }) {
  return <i className={"bi bi-" + name} style={style}></i>;
}
