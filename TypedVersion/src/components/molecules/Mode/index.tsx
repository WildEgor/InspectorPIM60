import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StyledSwitch from "../../atoms/StyledSwitch";
import PaperContainer from '../PaperContainer';
import LoaderContainer from "../LoaderContainer";
interface Props {
    getMode: () => Promise<any>
    setMode: (mode: number) => Promise<any>
}

export default function Mode(props: Props) {
    const [val, setVal] = useState<number>(0);

    const { getMode, setMode } = props;

    const getCameraMode = async () => {
        const response = await getMode();
        if (response) 
            setVal(Number(response));
    }

    const setCameraMode = async (mode: boolean) => {
        const check = mode? 0 : 1;
        await setMode(check);
        setVal(check);
    }

    return(
        <PaperContainer width={200} >
            <Box display='flex' position='relative' alignItems='center'>
                <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item><Typography variant='h5'>RUN</Typography></Grid>
                    <LoaderContainer updateData={getCameraMode}>
                        <Grid item>
                                <StyledSwitch
                                    value={val}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                        setCameraMode(checked);
                                    }}
                                />
                        </Grid>
                    </LoaderContainer>
                <Grid item><Typography variant='h5'>EDIT</Typography></Grid>
                </Grid>
            </Box>
        </PaperContainer>
    )
}