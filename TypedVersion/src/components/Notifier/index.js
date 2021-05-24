import React from 'react';
import { useSnackbar } from 'notistack';
import { useStoreActions, useStoreState } from 'easy-peasy';

let displayed = [];

const Notifier = (props) => {
    const {commands} = props
    const notifications = useStoreState(state => state.notifyController.notifications)
    const removeSnackbar = useStoreActions(actions => actions.notifyController.removeSnackbar)
    const enqueueSnackbarAction = useStoreActions(actions => actions.notifyController.enqueueSnackbar)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    const notify = (variant, msg) => {
        enqueueSnackbarAction({
            message: {
                ...msg,
                variant
            },
            options: {
                key: new Date().getTime() + Math.random(),
                variant,
                preventDuplicate: true,
                persist: true,
            },
        });
    }

    React.useEffect(() => {
        for (const [key, value] of Object.entries(commands)) {
            if (value.error) notify('error', { m: `Произошла ошибка команды - ${key}`, e: value.error})
        }
    }, [commands])

    React.useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    console.info("exited with key=" + JSON.stringify(myKey));
                    // remove this snackbar from redux store
                    removeSnackbar(myKey)
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar]);

    return null;
};

export default Notifier;