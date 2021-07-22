import React, { useEffect, useState, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';

import { TCamMode, TInspectorService } from "../../core/services/inspector.service";
import { StyledSwitch , StyledSkeleton, StyledBadge } from "../../style/components";

import { handlePromise } from "../../core/utils/http-utils";

interface Props {
    Inspector: TInspectorService
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        maxWidth: 180,
        minHeight: 60
    },
  }),
);

export default function Mode(props: Props) {
    const classes = useStyles();
    const [val, setVal] = useState<number>(0);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const { Inspector } = props;

    const getCameraMode = async () => {
        setPending(true);
        setError(false);
        const [resp, error] = await handlePromise(Inspector.getMode());
        if (!error && resp) {
            setVal(Number(resp.data));
            setPending(false);
            setError(false);
        } else {
            setError(true);
            setPending(false); 
        }
    }

    const setCameraMode = async (mode: boolean) => {
        setPending(true);
        setError(false);
        const check: TCamMode = mode? 0 : 1;
        setVal(check);
        const [resp, error] = await handlePromise(Inspector.setMode(check))
        if (!error) {
            setPending(false);
            setError(false);
        } else {
            setPending(false);
            setError(true);
        }
    }

    useEffect(() => {
        getCameraMode();
    }, [])

    return(
        <Paper className={classes.paper}>
            <StyledBadge color="secondary" badgeContent=" " invisible={!error}>
                <Box display='flex' position='relative' alignItems='center'>
                    {error && <IconButton aria-label="update toggle" onClick={getCameraMode}><CachedIcon/></IconButton>}
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item><Typography variant='h5'>RUN</Typography></Grid>
                    <Grid item>
                    {pending &&  <StyledSkeleton width={80} height={50} /> }
                    {
                        (!pending) &&
                        <StyledSwitch
                            disabled={error}
                            value={val}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                console.log(checked);
                                setCameraMode(checked);
                            }}
                        />
                    }
                    </Grid>
                        <Grid item><Typography variant='h5'>EDIT</Typography></Grid>
                    </Grid>
                </Box>
            </StyledBadge>
        </Paper>
    )
}