import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { StyledImage, StyledBadge } from "../../style/components";
import { TInspectorService, EOverlay, EImageSize } from "../../core/services/inspector.service";

interface Props {
    isRunning?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
  }),
);

export default function Toolbox(props: Props) {
    const { 
        isRunning = true
    } = props;

    const classes = useStyles();

    return(
        <Box></Box>
    );
}