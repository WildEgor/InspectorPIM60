import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { useInterval } from "react-use";

import { StyledImage, StyledBadge } from "../../style/components";
import { handlePromise } from "../../core/utils/http-utils";

interface Props {
    getImage?: () => Promise<any>,
    width?: number,
    height?: number,
    refreshTime?: number,
    isAutoUpdate?: boolean
}

interface ImageRawProps {
    maxWidth: number,
    minHeight: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        maxWidth: (props: ImageRawProps) => props.maxWidth,
        minHeight: (props: ImageRawProps) => props.minHeight,
    },
  }),
);

export default function ImageBox(props: Props) {
    const { 
        getImage,
        width = 480,
        height = 320,
        refreshTime = 700,
        isAutoUpdate = true
    } = props;
    const classes = useStyles({ maxWidth: width, minHeight: height });
    const [imageURL, setImageURL] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(refreshTime);

    const getImageURL = async () => {
        setPending(true);
        setError(false);

        const [response, error] = await handlePromise(getImage());
        if (!error && response) {
            setImageURL(response);
            setPending(false);
            setError(false);
        } else {
            setPending(false);
            setError(true); 
        }
    }

    useInterval(
        () => {
        if (!pending)
            getImageURL();
        },
        isAutoUpdate ? delay : null
    );

    useEffect(() => {
        getImageURL();
    }, [])

    return(
        <Paper className={classes.paper}>
            <Box display='flex' flexDirection='column'>
            <StyledBadge color="secondary" badgeContent=" " invisible={!error}></StyledBadge>
            <StyledImage
                src={imageURL}
                //errorIcon={<div>Error</div>}
            />
            </Box>
        </Paper>
    )
}