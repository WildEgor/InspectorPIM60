import React, { useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useStyles, StyledSkeleton, StyledButton, StyledSlider } from 'Style/components';
import Typography from '@material-ui/core/Typography';
import actionTypes from 'Store/actionTypes';
const {commonCommandsTypes} = actionTypes

const PatternForm = React.memo((props) => {
    const commands = useStoreState(state => state.commonCommands.commands)
    const setPatternScoreThreshold = useStoreActions(actions => actions.commonCommands.setPatternScoreThreshold)
    const getPatternScoreThreshold = useStoreActions(actions => actions.commonCommands.getPatternScoreThreshold)

    const {uid, onUpdate, formName} = props
    const classes = useStyles()

    const { handleSubmit, register, setValue, reset, control } = useForm();

    const resetDefaultData = () => {
        reset({[`Pattern_${uid}_ScoreThreshold`]: commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].data})
    }

    useEffect(() => {
        getPatternScoreThreshold({id: uid})
    }, []);

    useEffect(() => {
        resetDefaultData()
    }, [commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].data])

    return (
        <div className={classes.flexContainer}> 
                <form className={classes.flexColumnContainer} onSubmit={handleSubmit(data => {
                    setPatternScoreThreshold({id: uid, value: data[`Pattern_${uid}_ScoreThreshold`]})
                })}>
                <Controller
                    name={`Pattern_${uid}_ScoreThreshold`}
                    defaultValue={commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].data}
                    control={control}
                    render={(props) => (
                        <div className={classes.flexColumnContainer}>
                            <Typography id="continuous-slider" gutterBottom> Pattern score threshold [0, 100%]:</Typography>
                            {
                                commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].loading?
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
                        pending={commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].loading}
                        type='submit'
                        disabled={commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].loading || !!commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].error}
                    > Применить </StyledButton>
                    <StyledButton
                        onClick={() => getPatternScoreThreshold({id: uid}).then(() => onUpdate())}
                        type='reset'
                        disabled={commands[commonCommandsTypes.PATTERN_SCORE_THRESHOLD].loading}
                    > Запросить значения </StyledButton>
                    <StyledButton
                        onClick={() => resetDefaultData()}
                        type='reset'
                    > Сброс формы </StyledButton>
                </div>
            </form>
        </div> 
    )
})

export default PatternForm