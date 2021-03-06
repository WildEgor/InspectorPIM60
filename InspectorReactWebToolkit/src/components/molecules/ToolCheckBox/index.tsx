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
import StyledCheckBox from "../../atoms/StyledCheckBox";
import PaperContainer from "../PaperContainer";
import LoaderContainer from "../LoaderContainer";

interface Props {
    toolName: string; // Just text for this block 
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

export default function ToolCheckBox(props: Props) {
    const {
        getValue,
        setValue,
        toolName,
        commandID,
        toolID,
    } = props;

    const classes = useStyles();
    const [checkBoxValue, setCheckBoxValue] = useState<boolean>();
    const [refetchData, setRefetchData] = useState<boolean>(false);
    const [errorWhenUpdate, setErrorWhenUpdate] =  useState<boolean>(false);

    const getData = async () => {
        const args = []
        if (toolID) 
            args.push(toolID);
        
        const [errorGetData, responseData] = await getValue(commandID, args);
        if (!errorGetData) {
            setCheckBoxValue(!checkBoxValue);
            setErrorWhenUpdate(false)
        } else {
            setErrorWhenUpdate(true)
        }
    }

    const setData = async (newValue: boolean) => {
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
            setCheckBoxValue(newValue);
            setErrorWhenUpdate(false)
        } else {
            setErrorWhenUpdate(true)
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxValue(event.target.checked);
        setData(event.target.checked)
    }

    return (
        <PaperContainer width={200}>
            <Typography variant='h5'>{toolName}</Typography>
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
                        <FormGroup>
                        <FormControlLabel
                            disabled={!!errorWhenUpdate}
                            control={<StyledCheckBox checked={checkBoxValue} onChange={handleChange} name="settings" />}
                            label={<Typography variant='h5'>{toolName}</Typography>}
                        />
                        </FormGroup>
                    </FormControl>
                </Grid>
            </Grid>
            </LoaderContainer>
        </PaperContainer>
    );
}