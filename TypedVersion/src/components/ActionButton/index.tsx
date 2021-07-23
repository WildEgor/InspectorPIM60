import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { EActions, ECommands, TWidget, TInspectorService } from "../../core/services/inspector.service";

import StyledButton from "../atoms/StyledButton";
import StyledSkeleton from "../atoms/StyledSkeleton";
import StyledBadge from "../atoms/StyledBadge";
import PaperContainer from '../PaperContainer';

interface Props {
    id: EActions,
    toolName?: string,
    Inspector: TInspectorService
    squareside?: number,
    usedhcp?: number
}

export default function CheckBox(props: Props) {
const { 
    id,
    toolName,
    squareside = 6,
    usedhcp = 0,
    Inspector
} = props;
const [pending, setPending] = useState<boolean>(false); // network status
const [error, setError] = useState<boolean>(false); // network status
const [options, setOptions] = useState<TWidget>(Inspector.defaultSettings[id]); // defaultSettings
const [val, setVal] = useState<number>(Inspector.defaultSettings[id].defaultValue as number); // current slider value 

useEffect(() => {
    console.log();
}, [])

const setValue = async () => {
    try {
        setPending(true);
        setError(false);
        switch(id){
            case EActions.SAVE_TO_FLASH:
                await Inspector.performAction(id, []);
                Inspector.performAction(id, [])
                break;
            case EActions.RETEACH_REF_OBJ:
                await Inspector.performAction(id, [0]);
                break;
            case EActions.PERFORM_CALIBRATION:
                await Inspector.setInt(ECommands.CALIBRATION_MODE, [1]);
                await Inspector.performAction(id, [squareside]);
                break;
            case EActions.REMOVE_CALIBRATION:
                await Inspector.performAction(id, []);
                break;
            case EActions.APPLY_IP_SETTINGS:
                await Inspector.performAction(id, [usedhcp])
                break;
            case EActions.REBOOT_DEVICE:
                await Inspector.performAction(id, []);
                break;
            default:
                console.log();
                break;
        }
        setPending(false);
        setError(false);
    } catch (error) {
        console.error('[Action Button]: ', error);
        setPending(false);
        setError(true);
    } 
}

return(
    <PaperContainer width={200}>
        <StyledBadge color="secondary" badgeContent=" " invisible={!error}>
            <Box display='flex' position='relative' alignItems='center'>
                {pending && <><Typography variant='h5'>{options.toolName + ': '}</Typography><StyledSkeleton width={100} height={50}></StyledSkeleton></>}
                {!pending &&   
                    <StyledButton value={val} onClick={setValue} color='primary' variant="outlined">
                        <Typography>{options.toolName}</Typography>
                    </StyledButton>
                }
            </Box>
        </StyledBadge>
    </PaperContainer>   
    )
}