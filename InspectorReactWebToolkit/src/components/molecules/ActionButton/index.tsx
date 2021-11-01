import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import StyledButton from "../../atoms/StyledButton";
import PaperContainer from '../PaperContainer';
import LoaderContainer from "../LoaderContainer";
interface Props {
    id: number,
    toolName?: string,
    squareside?: number,
    usedhcp?: number
    setInt: (id: number, args?: number[]) => Promise<any>
}

export default function ActionButton(props: Props) {
const { 
    id,
    toolName,
    squareside = 6,
    usedhcp = 0,
} = props;

const [actionValue, setActionValue] = useState<number>(); 

const getActionValue = async () => {
    console.log()
}

const setValue = async () => {
    // switch(id){
    //     case EActions.SAVE_TO_FLASH:
    //         await Inspector.performAction(id, []);
    //         break;
    //     case EActions.RETEACH_REF_OBJ:
    //         await Inspector.performAction(id, [0]);
    //         break;
    //     case EActions.PERFORM_CALIBRATION:
    //         await Inspector.setInt(ECommands.MAIN_CALIBRATIONMODE, [1]);
    //         await Inspector.performAction(id, [squareside]);
    //         break;
    //     case EActions.REMOVE_CALIBRATION:
    //         await Inspector.performAction(id, []);
    //         break;
    //     case EActions.APPLY_IP_SETTINGS:
    //         await Inspector.performAction(id, [usedhcp])
    //         break;
    //     case EActions.REBOOT_DEVICE:
    //         await Inspector.performAction(id, []);
    //         break;
    //     default:
    //         console.log();
    //         break;
    // }
}

return(
    <PaperContainer width={200}>
        <Box display='flex' position='relative' alignItems='center'>
            <LoaderContainer updateData={getActionValue}>
                <StyledButton value={actionValue} onClick={setValue} color='primary' variant="outlined">
                    <Typography>{toolName}</Typography>
                </StyledButton>
            </LoaderContainer>
        </Box>
    </PaperContainer>   
    )
}