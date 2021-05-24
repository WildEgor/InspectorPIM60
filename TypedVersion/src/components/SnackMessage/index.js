import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '640px',
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        backgroundColor: props => {
            switch(props.type){
                case 'error':
                    return theme.palette.error.main
                default:
                    return theme.palette.primary.main
            }
        },
        width: '100%',
    },
    typography: {
        fontWeight: 'bold',
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between',
    },
    icons: {
        marginLeft: 'auto',
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
}));

const SnackMessage = forwardRef((props, ref) => {
    const classes = useStyles({type: props.type});
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState()

    useEffect(() => {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const editedAt = today.toISOString()
        setCurrentDate(editedAt)
    }, [])

    const handleExpandClick = useCallback(() => {
        setExpanded((oldExpanded) => !oldExpanded);
    }, []);

    const handleDismiss = useCallback(() => {
        closeSnackbar(props.id);
    }, [props.id, closeSnackbar]);

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <CardActions classes={{ root: classes.actionRoot }}>
                    <Typography variant="subtitle2" className={classes.typography}>{props.message}</Typography>
                    <div className={classes.icons}>
                        <IconButton
                            aria-label="Show more"
                            className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
                            onClick={handleExpandClick}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                        <IconButton className={classes.expand} onClick={handleDismiss}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Paper className={classes.collapse}>
                        <Typography gutterBottom> Код ошибки: </Typography>
                            {props.error || 'Error'}
                        <Typography gutterBottom> Время ошибки: </Typography>
                            {currentDate}
                    </Paper>
                </Collapse>
            </Card>
        </SnackbarContent>
    );
});

export default SnackMessage;