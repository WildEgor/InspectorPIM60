import React, { 
  useState, 
} from 'react';
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
  range: boolean | 'min' | 'max';
  max: number;
  min: number;
  multiplier: number;
  toolName: string;
  commandID: number;
  toolID: number;
  unit: number;
  dynamic?: string | boolean;
  getDynamic?: (args?: number[]) => Promise<any>;
  getValue: (id: number, args?: number[]) => Promise<any>;
  setValue: (id: number, args?: number[]) => Promise<any>;
}

interface ToolTipProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

export default function ToolSlider(props: Props) {
  const {
    range = false, // def
    max = 100, // def
    min = 0, // def
    multiplier = 1, //def
    commandID = 0, // change 
    toolID = -1,
    toolName = '',
    unit,
    dynamic,
    getDynamic,
    getValue,
    setValue
  } = props

  const [val, setVal] = useState<number | Array<number>>(range? [min, max] : min); // current slider value
  const [minValue, setMinValue] = useState<number>(min);
  const [maxValue, setMaxValue] = useState<number>(max);

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
      if (toolID !== -1) // If Slider has 'tool' index 
        args.push(toolID);

      console.log('Dynamic slider? ', dynamic)

      if (dynamic) { // Request dynamic params
        const response = await getDynamic(args);
        if (response) {
          console.log(`[Slider][getValue] ROI SIZE:`, response);
          if (dynamic === 'max'){
            setMaxValue(response)
          } else {
            setMinValue(response)
          }
        }
      }

      if (unit)
        args.push(unit);

      const response = await getValue(commandID, args);

      console.log(`[GET] ${commandID}: `, response);

      if (Array.isArray(response)){
        setVal([response[0] / multiplier, response[1] / multiplier]); 
      } else {
        setVal(response / multiplier);
      }
    console.log('[slider] Response: ', response);
  }

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setVal(newValue);
  };

  const sendPostRequest = async (event: any, newValue: number | number[]) => {

    const newArray = [];
    const decimals = (multiplier > 10 ? 1 : 0);

    if (toolID !== -1 && commandID > 40) // If id isn't Object Locator and has 'tool' index
      newArray.push(toolID);

    // ????????????????????????????????????
    if (Array.isArray(newValue)){
      newValue.forEach(num => Number((Number(num.toFixed(decimals)) * multiplier).toFixed(0)));
      newArray.push(...newValue);
    } else {
      newValue = Number((Number(newValue.toFixed(decimals)) * multiplier).toFixed(0));
      newArray.push(newValue);
    }

    if (unit)
      newArray.push(unit);
    
    try {
      const response = await setValue(commandID, newArray);
      console.log('[slider] Response: ', response);
    } catch (error) {
      console.error('[slider, setValue] Error: ', error);
    }
  }

  return (
    <PaperContainer width={400}>
        <Typography variant='h5' id="tool-slider-label" gutterBottom>
          {`${toolName}${(unit && unit == 1? ' [mm]' : ' [px] ')} : `}
        </Typography>
        <LoaderContainer 
          updateData={sendGetRequest} 
          //isPending={() => setPending(!pending)} 
          //isError={() => {setPending(!error)}}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item>
                <IconButton aria-label="update slider" onClick={() => { 
                  sendGetRequest()
                }}>
                  <CachedIcon/>
                </IconButton>
            </Grid>
            {(range === true || range === 'min') && 
            <Grid item spacing={3}>
              <Input
                name='slider-input-min'
                defaultValue={maxValue}
                // className={classes.input}
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
                    sendPostRequest(e, e.target.value === '' ? 0 : [Number(e.target.value), val[1]]);
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
                value={val}
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
                    sendPostRequest(e, e.target.value === '' ? 0 : [val[0], Number(e.target.value)]);
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