import React, { useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { useStyles, StyledSkeleton, StyledButton, StyledSlider } from 'Style/components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import actionTypes from 'Store/actionTypes';
const {commonCommandsTypes} = actionTypes

const ObjectLocatorForm = ((props) => {
    const commands = useStoreState(state => state.commonCommands.commands)
    const getObjLocMatchThreshold = useStoreActions(actions => actions.commonCommands.getObjLocMatchThreshold) 
    const setObjLocMatchThreshold = useStoreActions(actions => actions.commonCommands.setObjLocMatchThreshold) 
    const {formName, onUpdate} = props
    const classes = useStyles()

    const { handleSubmit, register, setValue, reset, control } = useForm();

    useEffect(() => {
        getObjLocMatchThreshold()
    }, [])

    const resetDefaultData = () => {
        reset({["ObjectLocator_MatchThreshold"]: commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].data})
    }

     useEffect(() => {
        resetDefaultData()
     }, [commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD]])

    return (
        <div className={classes.flexContainer}> 
                <form className={classes.flexColumnContainer} onSubmit={handleSubmit(data => {
                    if (data['ObjectLocator_MatchThreshold'] != commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD])
                        setObjLocMatchThreshold(data['ObjectLocator_MatchThreshold'])
                })}>
                {/* <Controller
                    name={'ObjectLocator_MatchThreshold'}
                    control={control}
                    defaultValue={commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].data}
                    render={(props) => (
                        <div className={classes.flexColumnContainer}>
                            <Typography id="continuous-slider" gutterBottom>
                                Object locator match threshold [0, 100%]:
                            </Typography>
                            {commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].loading? 
                            <Skeleton animation="wave" variant="rect">
                                <StyledTextField/>
                            </Skeleton>
                            :
                            <StyledTextField
                                id={formName}
                                name={'ObjectLocator_MatchThreshold'}
                                label=""
                                type="number"
                                inputRef={register}
                                variant="filled"
                                InputProps={{ 
                                inputProps: 
                                    { min: 0, max: 100 },
                                classes: {
                                    input: classes.resize,
                                }, 
                                }}
                            />
                            }
                        </div>
                    )}
                />                     */}
                <Controller
                    name={'ObjectLocator_MatchThreshold'}
                    control={control}
                    defaultValue={commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].data ?? 0}
                    render={(props) => (
                        <div className={classes.flexColumnContainer}>
                            <Typography id="continuous-slider" gutterBottom> Object locator match threshold [0, 100%]:</Typography>
                            {
                                commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].loading?
                                    <StyledSkeleton width={620} height={50} animation="wave" variant="rect"/>
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
                <div className={classes.flexContainer}>
                    <StyledButton
                        pending={commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].loading}
                        type='submit'
                        disabled={commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].loading || !!commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].error}
                    > Применить </StyledButton>
                    <StyledButton
                        disabled={commands[commonCommandsTypes.OBJECT_MATCH_THRESHOLD].loading}
                        onClick={() => getObjLocMatchThreshold().then(() => onUpdate())}
                        type='reset'
                    > Попробовать снова </StyledButton>
                    <StyledButton
                        onClick={() => resetDefaultData()}
                        type='reset'
                    > Сброс формы </StyledButton>
                </div>
            </form>
        </div> 
    )
})

export default ObjectLocatorForm