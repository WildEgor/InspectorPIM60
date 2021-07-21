import { TNotification, TAddNotification, ENotification } from "./notificationsTypes";
import { makeObservable, observable, action, autorun } from "mobx";
import { v4 as uuid } from "uuid";
import { makePersistable } from 'mobx-persist-store';

import RootStore from "../rootStore";

class notificationsStore {
    public notifications = [] as TNotification[]
    public store: RootStore
    constructor(rootStore: RootStore){
        this.store = rootStore;
        makeObservable(this, {
            notifications: observable,
            setNotification: action,
            clearNotification: action
        })

        autorun(() => {
            setInterval(() => {
                this.handleExpireNotifications(new Date().getTime())
            }, 1000)
        })

        makePersistable(
            this,
            {
              name: 'notificationsStore',
              properties: ['notifications'],
              storage: localStorage,  // localForage, window.localStorage, AsyncStorage all have the same interface
              expireIn: 86400000, // One day in millsesconds
              removeOnExpiration: true,
              stringify: false,
              debugMode: true,
            },
            { delay: 200, fireImmediately: false },
        ).then(
            action((persistStore) => {
              console.log(persistStore.isHydrated);
            })
        );
    }

    public setNotification = (notification: TAddNotification) => {
        console.log('Added notification: ', notification)
        const existing = this.notifications.find((n) => n.id === notification.id);
        const nextNotifications = existing
        ? this.notifications.map((n) =>
            n.id === notification.id ? { ...existing, ...notification } : n
          )
        : this.notifications.concat({
            id: uuid(),
            timestamp: new Date().getTime(),
            variant: ENotification.ERROR,
            ...notification
        });
        this.notifications = nextNotifications
    }

    public clearNotification = (id: number | string | number[] | string[]) => {
        if (!id) {
            this.notifications = []
          } else {
            const ids = Array.isArray(id) ? id : [id];
            const nextNotifications = this.notifications.filter(
              ({ id }) => !ids.includes(id)
            );
            this.notifications = nextNotifications
          }
    }

    public handleExpireNotifications = (currentTime) => {
        if (this.notifications.length) {
            const expiredIds = this.notifications.reduce((acc, n) => {
                const isExpired = n.timestamp <= currentTime - (n.timeout || 1000);
                    return isExpired && n.timeout !== null ? acc.concat(n.id) : acc;
                    }, []);
            if (expiredIds.length) {
                this.clearNotification(expiredIds);
            }
        }
    }
}

export default notificationsStore