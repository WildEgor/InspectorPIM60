import React, { useState } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import PaperContainer from "../PaperContainer";
import StyledToggleButton from "../../atoms/StyledToggleButton";
import LoaderContainer from '../LoaderContainer';
import { Grid } from '@material-ui/core';

interface Props {
    toolName: string
    toolID?: number,
    commandID: number,
    labels: string[]
    getInt: (id: number, args?: number[]) => Promise<any>
    setInt: (id: number, args?: number[]) => Promise<any>
}

export default function ToolToggleControl(props: Props): JSX.Element {
    const {
        toolName,
        labels,
        toolID,
        commandID,
        getInt,
        setInt
    } = props

    const [toggleLabels, setToogleLabels] = useState<string[]>(labels)
    const [toogleValue, setToggleValue] = useState<number>(0);
    const [refetchData, setRefetchData] = useState<boolean>(false);
    
    const getValue = async () => {
        const args = []
        if (toolID) 
            args.push(toolID);
        
        const [error, response] = await getInt(commandID, args);
        if (!error && response) {
            setToggleValue(response.data as number);
        }
    }

    const setValue = async (newValue: number) => {

        const newArray = [];
        if (toolID && commandID > 40) // If id isn't Object Locator and has 'tool' index
            newArray.push(toolID);
        
        if (Array.isArray(newValue)){
            newArray.push(...newValue);
        } else {
            newArray.push(newValue);
        }

        const [error, response] = await setInt(commandID, newArray)
        if (!error){
            setToggleValue(newValue);
        }
    }

    const onChange = (_event: React.MouseEvent<HTMLElement>, newValue: number) => {
        setValue(newValue);
    }

    return(
        <PaperContainer width={400}>
            <Typography variant='h5' id="tool-toggle-label" gutterBottom>
                {toolName + " :"}
            </Typography>
            <LoaderContainer 
                updateData={getValue} 
                needUpdate={refetchData}
            >
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <IconButton aria-label="update slider" onClick={ () => {
                            getValue(); 
                            setRefetchData(!refetchData)
                        }
                        }>
                        <CachedIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs>
                        <ToggleButtonGroup
                            value={toogleValue}
                            exclusive
                            onChange={onChange}
                        >
                            {
                                toggleLabels.map((title, i) => 
                                <StyledToggleButton key={`title_${i}`} value={i} aria-label="centered">
                                    <Typography variant='h5'>{title}</Typography>
                                </StyledToggleButton>)
                            }
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </LoaderContainer>
        </PaperContainer>
    )
}