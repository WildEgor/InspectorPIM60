import React, { useState } from 'react';
import { useInterval } from "react-use";
import PaperContainer from '../PaperContainer';
import LoaderContainer from "../LoaderContainer";
import Box from '@material-ui/core/Box';
import { Grid, Typography } from '@material-ui/core';

interface Props {
    id: number,
    multiplier?: number,
    updateRate?: 1 | 5 | 10,
    toolName?: string,
    getData: (id: number) => Promise<string[]>
}

const MonitorData = (props: Props) => {
    const { id, multiplier, updateRate, toolName, getData } = props;
    const [response, setResponse] = useState<string[]>([])
    const [needUpdate, setNeedUpdate] = useState<boolean>(false)

    const makeRequest = async () => {
        const reponse = await getData(id);
        if (reponse) {
            setResponse(reponse)
        }
    }

    useInterval(
        async function (){ 
            setNeedUpdate(true)
            makeRequest();
            setNeedUpdate(false)
        },
        updateRate
    );

    return(
        <PaperContainer width={200} >
            <Box display='flex' position='relative' alignItems='center'>
                <LoaderContainer updateData={makeRequest} >
                    <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>
                            <Typography>
                                {toolName}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography>
                                { response? response.reduce((acc, item) => acc + ' | ' + item) : ''}
                            </Typography>
                        </Grid>
                    </Grid>
                </LoaderContainer>
            </Box>
        </PaperContainer>
    )
}

export default MonitorData;
