import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { useInterval } from "react-use";

import { StyledImage, StyledBadge } from "../../style/components";
import { TInspectorService, EOverlay, EImageSize } from "../../core/services/inspector.service";

interface Props {
    id?: number,
    type?: 'liveImage' | 'logImage',
    Inspector: TInspectorService,
    scale?: EImageSize,
    overlay: EOverlay,
    width?: number,
    height?: number,
    refreshTime?: number,
    isRunning?: boolean
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
        id = 0,
        type = 'liveImage',
        Inspector,
        scale = 0,
        overlay,
        width = 480,
        height = 320,
        refreshTime = 700,
        isRunning = true
    } = props;
    const classes = useStyles({ maxWidth: width, minHeight: height });
    const [imageURL, setImageURL] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(refreshTime);

    useInterval(
        () => {
        if (!pending)
            getImage();
        },
        isRunning ? delay : null
    );

    const getImage = async () => {
        let response = null;

        setPending(true);
        switch(type) {
            case 'liveImage': 
                response = await Inspector.getLiveImage(Date.now(), scale, overlay);
                console.log('[Image Box][LiveImage] Response: ', response);
            break;
            case 'logImage':
                response = await Inspector.getLogImage(id, scale, overlay);
                console.log('[Image Box][LogImage] Response: ', response);
            break;
            default:
            break;
        }

        if (response) {
            setImageURL(response as string);
            setPending(false);
            setError(false);
        } else if (response.error) {
            console.error('[Image Box] Error: ', response.error);
            setPending(false);
            setError(true);
        }
    }

    useEffect(() => {
        getImage();
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