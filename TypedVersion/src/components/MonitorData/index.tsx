import React, { 
    useEffect, 
    useState, 
    // useContext 
} from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CachedIcon from '@material-ui/icons/Cached';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';

import { 
    StyledSlider, 
    StyledSkeleton, 
    StyledBadge 
} from "../../style/components";

import { ECommands, TWidget, TInspectorService } from "../../core/services/inspector.service";

interface Props {
    id: number,
    multiplier?: number,
    updateRate?: 1 | 5 | 10,
    showName?: boolean,
    Inspector: TInspectorService
}

const MonitorData = (props: Props) => {
    return(
        <div></div>
    )
}

export default MonitorData;
