import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import CachedIcon from '@material-ui/icons/Cached';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';

import StyledSlider from "../atoms/StyledSlider";
import PaperContainer from '../PaperContainer';
import LoaderContainer from "../molecules/LoaderContainer";

interface Props {
  range: boolean | 'min' | 'max'; // Range means you can use Slider to adjust params as 1 or 2 points 
  max: number; // Max value
  min: number; // Min value
  multiplier: number; // It needs for some commands
  toolName: string; // Just text for this block 
  commandID: number; // Unique cmd ID 
  toolID?: number; // Number of specific tool
  unit?: number; // Some cmd has units like 'mm' or 'px'
  dynamic?: string | boolean; // Some commands needs get additional data
  getDynamic?: (args?: number[]) => Promise<any>; // Use this function to get adds data
  getValue: (id: number, args?: number[]) => Promise<any>; // Use this function to get necessary data
  setValue: (id: number, args?: number[]) => Promise<any>; // and to set data
}

// For helps text above slider points 
interface ToolTipProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

export default function ToolSlider(props: Props): JSX.Element {
  const {
    range,
    max = 100,
    min = 0, 
    multiplier, 
    commandID, 
    toolID,
    toolName = '',
    unit,
    dynamic,
    getDynamic,
    getValue,
    setValue
  } = props

  const [sliderValue, setSliderValue] = useState<number | Array<number>>(range? [min, max] : min); // current slider value
  const [minValue, setMinValue] = useState<number>(min);
  const [maxValue, setMaxValue] = useState<number>(max);

  // MUI 
  function ValueLabelComponent(props: ToolTipProps) {
    const { children, open, value } = props;
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  // Request actual value 
  const sendGetRequest = async () => {
      const args = []
      if (toolID !== -1) // If Slider has 'tool' index, for example Object locator doesn't have toolID
        args.push(toolID);

      if (dynamic) { // Request dynamic params for MIN or MAX data
        const [errorDynamic, responseDynamic] = await getDynamic(args);
        if (!errorDynamic && responseDynamic) {
          console.log(`[Slider][getValue] ROI SIZE:`, responseDynamic);
          if (dynamic === 'max'){
            setMaxValue(responseDynamic)
          } else {
            setMinValue(responseDynamic)
          }
        }
      }

      if (unit) // 'mm' or 'px'
        args.push(unit);

      const [errorData, responseData] = await getValue(commandID, args);

      if (!errorData) {
        console.log(`[GET] ${commandID}: `, responseData);
        if (Array.isArray(responseData)){
          setSliderValue([responseData[0] / multiplier, responseData[1] / multiplier]); 
        } else {
          setSliderValue(responseData / multiplier);
        }
      }
  }

  // When change slider
  const handleSliderChange = (_event: any, newValue: number | number[]) => setSliderValue(newValue);
  
  // Request to send some data 
  const sendPostRequest = async (_event: any, newValue: number | number[]) => {
    const newArray = [];
    const decimals = (multiplier > 10 ? 1 : 0);

    if (toolID && commandID > 40) // If id isn't Object Locator and has 'tool' index
      newArray.push(toolID);

    // Check if data valid
    if (Array.isArray(newValue)){
      newValue.forEach(num => Number((Number(num.toFixed(decimals)) * multiplier).toFixed(0)));
      newArray.push(...newValue);
    } else {
      newValue = Number((Number(newValue.toFixed(decimals)) * multiplier).toFixed(0));
      newArray.push(newValue);
    }

    if (unit)
      newArray.push(unit);
    
    const [errorSend, responseSend] = await setValue(commandID, newArray);

    if (!errorSend) 
      console.log('[slider] Response: ', responseSend);
  }

  return (
    <PaperContainer width={400}>
        <Typography variant='h5' id="tool-slider-label" gutterBottom>
          {`${toolName}${unit && (unit === 1? ' [mm]' : ' [px] ')} : `}
        </Typography>
        <LoaderContainer 
          updateData={sendGetRequest} 
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item>
                <IconButton aria-label="update slider" onClick={sendGetRequest}>
                  <CachedIcon/>
                </IconButton>
            </Grid>
            {(range === true || range === 'min') && 
            <Grid item spacing={3}>
              <Input
                name='slider-input-min'
                defaultValue={maxValue}
                // className={classes.input}
                value={Array.isArray(sliderValue)? sliderValue[0] : sliderValue}
                margin="dense"
                onChange={e => {
                  if (Array.isArray(sliderValue)){
                    setSliderValue(e.target.value === '' ? 0 : [Number(e.target.value), sliderValue[1]]);
                  } else {
                    setSliderValue(e.target.value === '' ? 0 : Number(e.target.value));
                  }
                }}
                onBlur={e => {
                  if (Array.isArray(sliderValue)){
                    sendPostRequest(e, e.target.value === '' ? 0 : [Number(e.target.value), sliderValue[1]]);
                  } else {
                    sendPostRequest(e, e.target.value === '' ? 0 : Number(e.target.value));
                  }
                }}
                inputProps={{
                  step: multiplier > 10 ? 0.1 : 1,
                  min: minValue,
                  max: maxValue,
                  type: 'number',
                  'aria-labelledby': 'input-slider-min',
                }}
              />
            </Grid>
            }
            <Grid item xs>
              <StyledSlider 
                //disabled={error}
                valueLabelDisplay="auto"
                ValueLabelComponent={ValueLabelComponent}
                onChangeCommitted={sendPostRequest}
                onChange={handleSliderChange} 
                value={sliderValue}
                min={minValue} 
                max={maxValue}
                step={multiplier > 10 ? 0.1 : 1}
              />
            </Grid>
            {(range === true || range === 'max') && 
            <Grid item spacing={3}>
              <Input
                name='slider-input-max'
                defaultValue={max}
                // className={classes.input}
                value={Array.isArray(sliderValue)? sliderValue[1] : sliderValue}
                margin="dense"
                onChange={e => {
                  if (Array.isArray(sliderValue)){
                    handleSliderChange(e, e.target.value === '' ? 0 : [sliderValue[0], Number(e.target.value)]);
                  } else {
                    handleSliderChange(e, e.target.value === '' ? 0 : Number(e.target.value));
                  }
                }}
                onBlur={e => {
                  if (Array.isArray(sliderValue)){
                    sendPostRequest(e, e.target.value === '' ? 0 : [sliderValue[0], Number(e.target.value)]);
                  } else {
                    sendPostRequest(e, e.target.value === '' ? 0 : Number(e.target.value));
                  }
                } }
                inputProps={{
                  step: multiplier > 10 ? 0.1 : 1,
                  min: minValue,
                  max: maxValue,
                  type: 'number',
                  'aria-labelledby': 'input-slider-max',
                }}
              />
            </Grid>
            }
          </Grid>
        </LoaderContainer>
</PaperContainer>
  );
}