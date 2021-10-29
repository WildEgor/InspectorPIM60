import { makePersistable } from "mobx-persist-store";
import React, { createContext, ReactNode, useContext } from "react";
import NotificationsStore from "./notificationsStore/notificationsStore";

class RootStore {
    notificationStore: NotificationsStore
    constructor() {
        this.notificationStore = new NotificationsStore(this)

        // TODO add name of store in 'properties' if you want use storage as persistent local storage (notificationStore by default)
        // makePersistable(
        //   this,
        //   {
        //     name: 'SampleStore',
        //     properties: [''],
        //     storage: localStorage,  // localForage, window.localStorage, AsyncStorage all have the same interface
        //     expireIn: 86400000, // One day in millsesconds
        //     removeOnExpiration: true,
        //     stringify: false,
        //     debugMode: true,
        //   },
        //   { delay: 200, fireImmediately: true },
        // );
    }
}

// holds a reference to the store (singleton)
let store: RootStore

// create the context
export const StoreContext = createContext<RootStore | undefined>(undefined);

export const useStores = () => {
    const store = useContext(StoreContext)
    if (!store) {
      // this is especially useful in TypeScript so you don't need to be checking for null all the time
      throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}

// create the provider component
export function RootStoreProvider({ children }: { children: ReactNode }) {
  const root = store ?? new RootStore()
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>
}

export default RootStore