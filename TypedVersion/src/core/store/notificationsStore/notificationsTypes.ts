export enum ENotification {
    SUCCESS,
    ALERT,
    ERROR,
}

export type TNotification = {
    id: number | string;
    message: string | React.ReactNode;
    variant: ENotification;
    timestamp: number;
    timeout?: number | null; // pass in null for no timeout
}

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;
export type TAddNotification = OptionalExceptFor<TNotification, "message">;

export type TNotificationState = {
    notifications: TNotification[];
}

export type TNotificationAction = {
    setNotification: (notification: TAddNotification) => null,
    clearNotification: (id: number) => null
}

export type NotificationsStoreSchema = TNotificationState & TNotificationAction;