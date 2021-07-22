import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';

import { ECommands, TWidget, TInspectorService } from "../../core/services/inspector.service";
import { StyledToggleButton , StyledSkeleton, StyledBadge } from "../../style/components";

import { handlePromise } from "../../core/utils/http-utils";

interface Props {
    tool?: number,
    id: ECommands,
    labels?: string[]
    Inspector: TInspectorService
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      alignItems: 'center',
      maxWidth: 260,
    },
  }),
);

export default function ToggleControl(props: Props): JSX.Element {
    const {
        labels,
        id = 0,
        tool = -1,
        Inspector
    } = props

    const classes = useStyles(); // css in js styles
    const [pending, setPending] = useState<boolean>(false); // network status
    const [error, setError] = useState<boolean>(false); // network status
    const [options, setOptions] = useState<TWidget>(Inspector.defaultSettings[id]); // defaultSettings
    const [val, setVal] = useState<number>(Inspector.defaultSettings[id].defaultValue as number); // current 
    
    const getValue = async () => {
        setPending(true);
        setError(false);
        console.log('getValue');

        const args = []
        if (tool !== -1) 
            args.push(tool);
        
        const [resp, error] = await handlePromise(Inspector.getInt(id, args));
        if (!error && resp) {
            setVal(resp.data);
            setPending(false);
            setError(false);
        } else {
            setPending(false);
            setError(true);
        }
    }

    const setValue = async (event: any, newValue: number) => {
        setPending(true);
        setError(false);

        const newArray = [];
        if (tool !== -1 && id > 40) // If id isn't Object Locator and has 'tool' index
            newArray.push(tool);
        
        if (Array.isArray(newValue)){
            newArray.push(...newValue);
        } else {
            newArray.push(newValue);
        }

        setVal(newValue);

        const [resp, error] = await handlePromise(Inspector.setInt(id, newArray))

        setPending(false);
        setError(false);

        if (error){
            setPending(false);
            setError(true);
        }
    }

    const onChange = (event: React.MouseEvent<HTMLElement>, newValue: number) => {
        console.log('onChange');
        setValue(event, newValue);
    }

    useEffect(() => {
        if(labels)
            setOptions({...options, labels});

        getValue();
    }, [])

    return(
        <Box display="flex">
            <Paper className={classes.paper}>
                <Typography variant='h5' id="tool-toggle-label" gutterBottom>
                    {options.toolName + " :"}
                </Typography>
            <StyledBadge color="secondary" badgeContent=" " invisible={!error}>
                <Box>
                    { pending && <StyledSkeleton  width={100} height={50}/> }
                    { error && <IconButton aria-label="update toggle" onClick={() => {
                        console.log('UPDATE BUTTON')
                        getValue();
                    }}><CachedIcon/></IconButton> }
                    { !pending && 
                        <ToggleButtonGroup
                            value={val}
                            exclusive
                            onChange={onChange}
                        >
                            {
                                options.labels.map((title, i) => 
                                <StyledToggleButton disabled={error} key={`title_${i}`} value={i} aria-label="centered">
                                    <Typography variant='h5'>{title}</Typography>
                                </StyledToggleButton>)
                            }
                        </ToggleButtonGroup> 
                    }
                </Box>
            </StyledBadge>
            </Paper>
        </Box>
        
    )
}