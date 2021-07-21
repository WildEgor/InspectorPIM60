import { autorun, toJS } from "mobx";

export function autoSave(store, save) {
    let firstRun = true;
    autorun(() => {
      // This code will run every time any observable property
      // on the store is updated.
      const json = JSON.stringify(toJS(store));
      if (!firstRun) {
        save(json);
      }
      firstRun = false;
    });
}
 