import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StyledSwitch from "../../atoms/StyledSwitch";
import PaperContainer from '../PaperContainer';
import LoaderContainer from "../LoaderContainer";
interface Props {
    labels?: string[]
    getMode: () => Promise<number>
    setMode: (mode: number) => Promise<boolean>
}

export default function Mode(props: Props) {
    const [buttonValue, setButtonValue] = useState<number>(0);
    const [errorWhenUpdate, setErrorWhenUpdate] = useState<boolean>(false)

    const { getMode, setMode, labels = ['RUN', 'EDIT'] } = props;

    const getCameraMode = async () => {
        const response = await getMode();
        if (response) setButtonValue(response);
    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setButtonValue(event.target.checked? 1 : 0);
        await setMode(buttonValue);
    };

    return(
        <PaperContainer width={200} >
            <Box display='flex' position='relative' alignItems='center'>
                <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item><Typography variant='h5'>Change camera mode</Typography></Grid>
                <Grid item xs>
                    <LoaderContainer updateData={getCameraMode} isError={setErrorWhenUpdate}>
                        <Grid item><Typography variant='h5'>{labels[0]}</Typography></Grid>
                                <Grid item>
                                        <StyledSwitch
                                            disabled={errorWhenUpdate}
                                            value={buttonValue}
                                            onChange={handleChange}
                                        />
                                </Grid>
                        <Grid item><Typography variant='h5'>{labels[1]}</Typography></Grid>
                    </LoaderContainer>
                </Grid>
                </Grid>
            </Box>
        </PaperContainer>
    )
}