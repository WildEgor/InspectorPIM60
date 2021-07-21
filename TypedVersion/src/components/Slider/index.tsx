import React, { 
  useEffect, 
  useState, 
  // useContext 
} from 'react';
// import { StoreContext } from "../../core/store/rootStore";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CachedIcon from '@material-ui/icons/Cached';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';

import { 
  StyledSlider, 
  StyledSkeleton, 
  StyledBadge 
} from "../../style/components";

import { ECommands, TWidget, TInspectorService } from "../../core/services/inspector.service";

/**
 * @info General Slider Props
 * @param ip Device IP-address
 * @param id Command channel identifier
 * @param max Upper threshold
 * @param min Lower threshold
 * @param step Slider step
 * @param range Regular or range slider
 * @param tool Tool device index
 * @param unit Unit to set the value in, i.e. pixels ( = 0) or mm ( = 1)
 */
interface Props {
  range?: boolean | 'min' | 'max',
  max?: number,
  min?: number,
  multiplier?: number,
  toolName?: string,
  tool?: number,
  id: ECommands,
  unit?: number, 
  Inspector: TInspectorService
}

/**
 * @info General ToolTip Props
 * @param children React Node
 * @param open Active show tooltip
 * @param value Current slider value
 */
interface ToolTipProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

/**
 * MUI Component style
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      maxWidth: 400,
    },
    icon: {
      margin: 'auto'
    },
    input: {
      width: 50,
    }
  }),
);

/**
 * @info Slider FC Component
 * @param props Component Props
 * @returns Html Component
 */
export default function Slider(props: Props) {
  const {
    range = false, 
    max = 100, 
    min = 0,
    multiplier = 1,
    id = 0,
    tool = -1,
    toolName,
    unit,
    Inspector
  } = props

  // const { notificationStore } = useContext(StoreContext);

  const classes = useStyles(); // css in js styles
  const [pending, setPending] = useState<boolean>(false); // network status
  const [error, setError] = useState<boolean>(false); // network status
  const [options, setOptions] = useState<TWidget>(Inspector.defaultSettings[id]); // defaultSettings
  const [val, setVal] = useState<number | Array<number>>(Inspector.defaultSettings[id].range? [Inspector.defaultSettings[id].min, Inspector.defaultSettings[id].max] : Inspector.defaultSettings[id].min); // current slider value 

  // MUI Slider help function
  function ValueLabelComponent(props: ToolTipProps) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  // Request actual value 
  const getValue = async () => {
    try {
      setPending(true);
      setError(false);

      const args = []
      if (tool !== -1) // If Slider has 'tool' index 
        args.push(tool);

      if (options.dynamic) { // Request dynamic params
        const resp = await Inspector.getInt(ECommands.GET_ROI_SIZE, args);
        console.log(`[Slider][getValue] ${ECommands.GET_ROI_SIZE}: `, resp);

        if (options.dynamic == 'max'){
          setOptions({...options, max: resp.data})
        } else {
          setOptions({...options, min: resp.data})
        }
      }

      if (unit !== undefined && unit !== null)
        args.push(unit);

      const resp = await Inspector.getInt(id, args);

      console.log(`[GET] ${id}: `, resp);

      if (Array.isArray(resp.data)){
        setVal([resp.data[0] / options.multiplier, resp.data[1] / options.multiplier]); 
      } else {
        setVal(resp.data / options.multiplier);
      }
      
      console.log('[slider] Response: ', resp);

      setPending(false);
      setError(false);
    } catch (error) {
      console.error('[slider, getValue] Error: ', error);
      setPending(false);
      setError(true);
    }
  }

  useEffect(() => { 
    if (min) // use defaultSettings?
      setOptions({...options, min});
    if (max)
      setOptions({...options, max});
    if (multiplier) 
      setOptions({...options, multiplier});
    if (range)
      setOptions({...options, range});
    if (toolName)
      setOptions({...options, toolName});
    if (unit !== undefined && unit !== null)
      setOptions({...options, unit});

    options.step = (options.multiplier > 10 ? 0.1 : 1);

    getValue();
  }, [])

  /**
   * @info 
   * @param event 
   * @param newValue 
   */
  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setVal(newValue);
  };

  // useEffect(() => {
  //   if (error)
  //     notificationStore.setNotification({
  //       message: `[error] ${toolName}`,
  //       variant: 1,
  //       timeout: 10000
  //     })
  // }, [error])

  const fetchNewData = async (event: any, newValue: number | number[]) => {
    setPending(true);
    setError(false);

    const newArray = [];
    const decimals = (options.multiplier > 10 ? 1 : 0);

    if (tool !== -1 && id > 40) // If id isn't Object Locator and has 'tool' index
      newArray.push(tool);

    console.log(tool);

    // ????????????????????????????????????
    if (Array.isArray(newValue)){
      newValue.forEach(num => Number((Number(num.toFixed(decimals)) * options.multiplier).toFixed(0)));
      newArray.push(...newValue);
    } else {
      newValue = Number((Number(newValue.toFixed(decimals)) * options.multiplier).toFixed(0));
      newArray.push(newValue);
    }

    if (options.unit)
      newArray.push(options.unit);
    
    try {
      const resp = await Inspector.setInt(id, newArray);
      setPending(false);
      setError(false);
      console.log('[slider] Response: ', resp);
    } catch (error) {
      setPending(false);
      setError(true);
      console.error('[slider, fetchNewData] Error: ', error);
    }
  }

  return (
      <Paper className={classes.paper}>
        <Box display='flex' flexDirection='column'>
        <Typography variant='h5' id="tool-slider-label" gutterBottom>
          {options.toolName + " :"}
          {options.unit? 'mm' : 'px'}
        </Typography>
        {pending && <StyledSkeleton/> } 
        {!pending &&
        <StyledBadge color="secondary" badgeContent=" " invisible={!error}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
              <IconButton aria-label="update slider" onClick={getValue}>
                <CachedIcon/>
              </IconButton>
          </Grid>
          {(options.range == true || options.range == 'min') && 
          <Grid item spacing={3}>
            <Input
              name='slider-input-min'
              defaultValue={max}
              className={classes.input}
              value={Array.isArray(val)? val[0] : val}
              margin="dense"
              onChange={e => {
                if (Array.isArray(val)){
                  setVal(e.target.value === '' ? 0 : [Number(e.target.value), val[1]]);
                } else {
                  setVal(e.target.value === '' ? 0 : Number(e.target.value));
                }
              }}
              onBlur={e => {
                if (Array.isArray(val)){
                  fetchNewData(e, e.target.value === '' ? 0 : [Number(e.target.value), val[1]]);
                } else {
                  fetchNewData(e, e.target.value === '' ? 0 : Number(e.target.value));
                }
              }}
              inputProps={{
                step: options.step,
                min: options.min,
                max: options.max,
                type: 'number',
                'aria-labelledby': 'input-slider-min',
              }}
            />
          </Grid>
          }
          <Grid item xs>
            <StyledSlider 
              disabled={error}
              valueLabelDisplay="auto"
              ValueLabelComponent={ValueLabelComponent}
              onChangeCommitted={fetchNewData}
              onChange={handleSliderChange} 
              value={val}
              max={options.max} 
              min={options.min} 
              step={options.step}
            />
          </Grid>
          {(options.range == true || options.range == 'max') && 
          <Grid item spacing={3}>
            <Input
              name='slider-input-max'
              defaultValue={max}
              className={classes.input}
              value={Array.isArray(val)? val[1] : val}
              margin="dense"
              onChange={e => {
                if (Array.isArray(val)){
                  handleSliderChange(e, e.target.value === '' ? 0 : [val[0], Number(e.target.value)]);
                } else {
                  handleSliderChange(e, e.target.value === '' ? 0 : Number(e.target.value));
                }
              }}
              onBlur={e => {
                if (Array.isArray(val)){
                  fetchNewData(e, e.target.value === '' ? 0 : [val[0], Number(e.target.value)]);
                } else {
                  fetchNewData(e, e.target.value === '' ? 0 : Number(e.target.value));
                }
              } }
              inputProps={{
                step: options.step,
                min: options.min,
                max: options.max,
                type: 'number',
                'aria-labelledby': 'input-slider-max',
              }}
            />
          </Grid>
          }
        </Grid>
        </StyledBadge>
        }
        </Box>
      </Paper>
  );
}