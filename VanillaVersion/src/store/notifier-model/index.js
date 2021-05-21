import { action } from 'easy-peasy';

const NotifierModel = {
    notifications: [],
    enqueueSnackbar: action((state, payload) => {
        const key = payload.options && payload.options.key
        let find = false
        
        state.notifications.forEach(notification => {
            (notification && notification.message.m === payload.message.m)? find = true : null
        })

        if (!find){
            state.notifications = [
                ...state.notifications,
                {
                    key: key || new Date().getTime() + Math.random(),
                    ...payload
                }
            ]
        }
    }),
    closeSnackbar: action((state, payload) => {
        let dismissAll = false
        if (!payload)
            dismissAll = true
        state.notifications = state.notifications.map(notification => (
            (dismissAll || notification.key === payload.key)
                ? { ...notification, dismissed: true }
                : { ...notification }
        ))
    }),
    removeSnackbar: action((state, payload) => {
        state.notifications = state.notifications.filter(notification => {
            (notification.key !== payload.key)? {notification} : null
        })
    })
}

export default NotifierModel