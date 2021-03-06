import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import StyledRadioButton from "../../atoms/StyledRadioButton";
import RadioGroup from '@mui/material/RadioGroup'
import PaperContainer from "../PaperContainer";
import LoaderContainer from "../LoaderContainer";

interface Props {
    toolName: string; // Just text for this block 
    labels: string[];
    commandID: number; // Unique cmd ID 
    toolID?: number; // Number of specific tool
    getValue: (id: number, args?: number[]) => Promise<any>
    setValue: (id: number, args?: number[]) => Promise<any>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
        margin: theme.spacing(3),
    },
  }),
);

export default function ToolRadioButton(props: Props) {
    const {
        getValue,
        setValue,
        toolName,
        commandID,
        toolID,
        labels
    } = props;

    const classes = useStyles();
    const [radioValue, setRadioValue] = useState<string>('0');
    const [radioLabels, setRadioLabels] = useState<string[]>(labels)
    const [refetchData, setRefetchData] = useState<boolean>(false);
    const [errorWhenUpdate, setErrorWhenUpdate] =  useState<boolean>(false);

    const getData = async () => {
        const args = []
        if (toolID) 
            args.push(toolID);
        
        console.log('RADIO BUTTON COMMAND: ', commandID)    
        const [errorGetData, responseData] = await getValue(commandID, args);
        if (!errorGetData) {
            console.log('RADIO BUTTON DATA: ', responseData)
            setRadioValue(responseData);
            setErrorWhenUpdate(false)
        } else {
            setErrorWhenUpdate(true)
        }
    }

    const setData = async (newValue: string) => {
        const newArray = [];
        if (toolID && commandID > 40)
            newArray.push(toolID);
        
        if (Array.isArray(newValue)){
            newArray.push(...newValue);
        } else {
            newArray.push(newValue);
        }

        const [errorSetData, responseData] = await setValue(commandID, newArray);
        if (!errorSetData) {
            setRadioValue(newValue);
            setErrorWhenUpdate(false)
        } else {
            setErrorWhenUpdate(true)
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        console.log('RADIO GROUP VALUE: ', value)
        setRadioValue(value);
        setData(value);
    }
    
    return (
        <PaperContainer width={400}>
            <Typography variant='h5' id="tool-checkbox-label" gutterBottom>
                {toolName}
            </Typography>
            <LoaderContainer 
                updateData={getData} 
                needUpdate={refetchData}
            >
            <Grid container spacing={1} alignItems="center">
                <Grid item>
                    <IconButton
                        aria-label="update slider"
                        onClick={ () => {
                            getData(); 
                            setRefetchData(!refetchData)
                        }
                        }
                        size="large">
                    <CachedIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <RadioGroup row aria-label="gender" name="gender1" value={radioValue} onChange={handleChange}>
                            {radioLabels.map((label, id) => {
                                return(
                                    <FormControlLabel
                                        key={label}
                                        // disabled={!!errorWhenUpdate}
                                        value={`${id}`}
                                        control={<StyledRadioButton/>}
                                        label={<Typography variant='h5'>{label}</Typography>}
                                    />
                                )
                            })}
                            
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            </LoaderContainer>
        </PaperContainer>
    );
}