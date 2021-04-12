import React, { useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Skeleton from '@material-ui/lab/Skeleton';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Typography from '@material-ui/core/Typography';
import actionTypes from 'Store/actionTypes';
const {commonCommandsTypes} = actionTypes

import { useStyles, StyledSlider, StyledButton } from 'Style/components';

const EdgeCounterForm = (props) => {
    const commands = useStoreState(state => state.commonCommands.commands)
    
    const classes = useStyles()
    const {uid, onUpdate, formName} = props

    const setEdgePixelCounterForm = useStoreActions(actions => actions.commonCommands.setEdgePixelCounterForm)
    const getEdgePixelCounterForm = useStoreActions(actions => actions.commonCommands.getEdgePixelCounterForm)
    
    const { handleSubmit, register, setValue, reset, control } = useForm()

    useEffect(() => {
        getEdgePixelCounterForm({id: uid})
    }, [])

    const resetDefaultData = () => {
        reset({
            [`EdgeCounter_${uid}_Strength`]: commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].data,
            [`EdgeCounter_${uid}_PixelsThresholds`]: commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
        })
    }

    useEffect(() => {
        resetDefaultData()
    }, [commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].data, commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data])

    return (
        <div className={classes.flexContainer}> 
            <form className={classes.flexColumnContainer} onSubmit={handleSubmit(data => {
                console.log(data)
                setEdgePixelCounterForm({id: uid, values: [data[`EdgeCounter_${uid}_Strength`], data[`EdgeCounter_${uid}_PixelsThresholds`][0], data[`EdgeCounter_${uid}_PixelsThresholds`][1]]})
            })}>
            <Controller
                name={`EdgeCounter_${uid}_Strength`}
                control={control}
                defaultValue={commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].data ?? 0}
                render={(props) => (
                        <div className={classes.flexColumnContainer}>
                            <Typography id="continuous-slider" gutterBottom> Edge counter strength [0, 100%]:</Typography>
                            {
                                commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].loading?
                                    <Skeleton animation="wave" variant="rect">
                                        <StyledSlider/>
                                    </Skeleton>
                                    :
                                    <StyledSlider
                                        {...props}
                                        onChange={(_, value) => {
                                            props.onChange(value);
                                        }}
                                        max={100}
                                        step={1}
                                    />
                            }
                        </div>
                )}
            />                
            <Controller
                name={`EdgeCounter_${uid}_PixelsThresholds`}
                control={control}
                defaultValue={commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data}
                render={(props) => (
                <div className={classes.flexColumnContainer}>
                    <Typography id="continuous-slider" gutterBottom>
                        Edge Counter pixels thresholds [0, ROISize]:
                    </Typography>
                    {
                        commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading 
                        ?
                        <Skeleton animation="wave" variant="rect">
                            <StyledSlider/>
                        </Skeleton>
                        :
                        <StyledSlider
                            {...props}
                            onChange={(_, value) => {
                                props.onChange(value);
                            }}
                            valueLabelDisplay="auto"
                            max={commands[commonCommandsTypes.ROI_SIZE].data}
                            step={1}
                        />
                    }
                </div>
            )}
            />
            <div className={classes.flexContainer}>
                <StyledButton
                    pending={
                        (commands[commonCommandsTypes.ROI_SIZE].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading)
                    }
                    type='submit'
                    disabled={
                        (commands[commonCommandsTypes.ROI_SIZE].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading
                        || !!commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].error)
                    }
                > Применить </StyledButton>
                <StyledButton
                    onClick={() => getEdgePixelCounterForm({id: uid}).then(() => onUpdate())}
                    type='reset'
                    disabled={
                        (commands[commonCommandsTypes.ROI_SIZE].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].loading
                        || commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading)
                    }
                > Попробовать снова </StyledButton>
                <StyledButton
                    onClick={() => resetDefaultData()}
                    type='reset'
                > Сброс формы </StyledButton>
            </div>
        </form> 
        </div> 
    )
}

export default EdgeCounterForm