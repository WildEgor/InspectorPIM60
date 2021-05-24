import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from '../template/template';
import Button from '@material-ui/core/Button';
import Notifier from 'Components/Notifier';
import { useStoreActions } from 'easy-peasy';

const App = () => {
    const enqueueSnackbar = useStoreActions(actions => actions.notifyController.enqueueSnackbar)
    const closeSnackbar = useStoreActions(actions => actions.notifyController.closeSnackbar)

    const handleClick = () => {
        // NOTE:
        // if you want to be able to dispatch a `closeSnackbar` action later on,
        // you SHOULD pass your own `key` in the options. `key` can be any sequence
        // of number or characters, but it has to be unique for a given snackbar.
        enqueueSnackbar({
            message: {
                m: { message: `Произошла ошибка команды ${Math.floor(Math.random() * 3)}`, error: '', description: ''},
                type: 'warning'
            },
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'warning',
                preventDuplicate: true,
                action: key => (
                    <Button onClick={() => closeSnackbar(key)}>dismiss me</Button>
                ),
            },
        });
    };

    const handleDimissAll = () => {
        closeSnackbar();
    };

    return (
        <Fragment>
            <Notifier />
            <Button variant="contained" onClick={handleClick}>Display snackbar</Button>
            <Button variant="contained" onClick={handleDimissAll}>Dismiss all snackbars</Button>
        </Fragment>
    );
};

// ReactDOM.render(<AppWrapper><App></App></AppWrapper>, document.getElementById('root'));
