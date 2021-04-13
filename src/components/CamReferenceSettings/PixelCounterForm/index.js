import React, { useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { useStyles, StyledSlider, StyledButton } from 'Style/components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import actionTypes from 'Store/actionTypes';
const {commonCommandsTypes} = actionTypes

const PixelCounterForm = (props) => {
    const commands = useStoreState(state => state.commonCommands.commands)
    
    const getPixelCounterForm = useStoreActions(actions => actions.commonCommands.getPixelCounterForm)
    const setPixelCounterForm = useStoreActions(actions => actions.commonCommands.setPixelCounterForm)

    const classes = useStyles()
    const {uid, onUpdate, formName} = props
    const { handleSubmit, register, setValue, reset, control } = useForm()
    
    useEffect(() => { getPixelCounterForm({id: uid}) }, [])

    const resetDefaultData = () => {
        reset({
            [`${formName}_${uid}_IntensityRange`]: commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].data,
            [`${formName}_${uid}_NORange`]: commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
        })
    }

    useEffect(() => {
        resetDefaultData()
    }, [commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].data, commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data])

    return (
        <div className={classes.flexContainer}> 
            <form className={classes.flexColumnContainer} onSubmit={handleSubmit((data) => {
                console.log('setPixelCounterForm', data)
                setPixelCounterForm({id: uid, values: [data[`${formName}_${uid}_IntensityRange`], data[`${formName}_${uid}_NORange`]].flat()})
            })}>
                <Controller
                    name={`${formName}_${uid}_IntensityRange`}
                    control={control}
                    defaultValue={commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].data}
                    render={(props) => (
                <div className={classes.flexColumnContainer}>
                    <Typography id="continuous-slider" gutterBottom>
                        Pixel Counter intensity range thresholds [0, 255]:
                    </Typography>
                    {
                            commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].loading?
                            <Skeleton animation="wave" variant="rect">
                                <StyledSlider/>
                            </Skeleton>
                            :
                            <StyledSlider
                                {...props}
                                onChange={(_, value) => {
                                    props.onChange(value);
                                }}
                                max={255}
                                step={1}
                            />
                    }
                </div>
            )}
            />
                <Controller
                name={`${formName}_${uid}_NORange`}
                control={control}
                defaultValue={commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data}
                render={(props) => (
                <div className={classes.flexColumnContainer}>
                    <Typography id="continuous-slider" gutterBottom>
                        Pixel Counter No. of pixels in range thresholds [0, ROISize]:
                    </Typography>
                        {
                            commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading?
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
                        (commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading
                        || commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].loading)
                    }
                    type='submit'
                    disabled={
                        (commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading
                        || commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].loading
                        || !!commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].error
                        || !!commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].error
                        || !!commands[commonCommandsTypes.ROI_SIZE].error
                        )
                    }
                > Применить </StyledButton>
                <StyledButton
                    onClick={() => {getPixelCounterForm({id: uid})}}
                    type='reset'
                    disabled={
                        commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].loading
                        || commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].loading
                    }
                > Попробовать снова </StyledButton>
                <StyledButton
                    onClick={() => {resetDefaultData()}}
                    type='reset'
                > Сброс формы </StyledButton>
            </div>
        </form>
        </div> 
    )
}

export default PixelCounterForm