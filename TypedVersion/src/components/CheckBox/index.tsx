import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';

import { TWidget, TInspectorService } from "../../core/services/inspector.service";
import StyledCheckBox from "../atoms/StyledCheckBox";
import StyledBadge from "../atoms/StyledBadge";
import StyledSkeleton from "../atoms/StyledSkeleton";
import PaperContainer from "../PaperContainer";

interface Props {
    id: number,
    tool: number,
    Inspector: TInspectorService
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
        margin: theme.spacing(3),
    },
  }),
);

export default function CheckBox(props: Props) {
    const { 
        Inspector, 
        id = 0,
        tool = -1
    } = props;

    const classes = useStyles();
    const [options, setOptions] = useState<TWidget>(Inspector.defaultSettings[id]); // defaultSettings
    const [val, setVal] = useState<boolean>(Inspector.defaultSettings[id].defaultValue as boolean);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getValue = async () => {
        setPending(true);
        setError(false);

        const args = []
        if (tool !== -1) 
            args.push(tool);
        
        try {
            const resp = await Inspector.getInt(id, args);
            setVal(resp.data);
            setPending(false);
            setError(false);
        } catch (error) {
            setPending(false);
            setError(true);
        }
    }

    const setValue = async (_event: any, newValue: boolean) => {
        setPending(true);
        setError(false);

        const newArray = [];
        if (tool !== -1 && id > 40)
            newArray.push(tool);
        
        if (Array.isArray(newValue)){
            newArray.push(...newValue);
        } else {
            newArray.push(newValue);
        }

        setVal(newValue);

        try {
            await Inspector.setInt(id, newArray);
            setPending(false);
            setError(false);
        } catch (error) {
            setPending(false);
            setError(true);
        }
    }

    useEffect(() => {
        getValue();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVal(event.target.checked);
        setValue(event, event.target.checked);
    }

    return(
        <PaperContainer width={200}>
            { error && <IconButton aria-label="update toggle" onClick={getValue}><CachedIcon/></IconButton> }
            { pending && <StyledSkeleton  width={100} height={50}/> }
            <StyledBadge color="secondary" badgeContent=" " invisible={!error}>
            { !pending && 
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormGroup>
                    <FormControlLabel
                        disabled={error}
                        control={<StyledCheckBox checked={val} onChange={handleChange} name="settings" />}
                        label={<Typography variant='h5'>{options.toolName}</Typography>}
                    />
                    </FormGroup>
                </FormControl>
            }
            </StyledBadge>
        </PaperContainer>
    )
}