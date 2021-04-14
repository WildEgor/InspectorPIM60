import React, { useState, useEffect } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControl from '@material-ui/core/FormControl';
import { useForm, Controller } from "react-hook-form";
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import useInterval from 'Hooks/useInterval';
import Alert from '@material-ui/lab/Alert';
import Notifier from 'Components/Notifier';

import SelectOverlay from 'Components/SelectOverlay';

import actionTypes from 'Store/actionTypes';
const {liveImagesTypes, logImagesTypes, commonCommandsTypes} = actionTypes

import {
    useStyles, 
    BorderLinearProgress, 
    StyledToggleButton,  
    StyledTextField, 
    StyledViewerImage,
    StyledAccordion,
    StyledAccordionSummary } from 'Style/components';

const CamViewer = () => {
    // 'Easy-peasy'
    const loadImage = useStoreActions(actions => actions.liveImages.loadImage); // Request real image

    const startStopLive = useStoreActions(actions => actions.liveImages.startStopLive);
    const getCamMode = useStoreActions(actions => actions.commonCommands.getCamMode);
    const setRefreshRate = useStoreActions(actions => actions.liveImages.setRefreshRate);

    const commands = useStoreState(state => state.liveImages.commands);
    //const logCommands = useStoreState(state => state.liveImages.commands);
    const commonCommands = useStoreState(state => state.commonCommands.commands);

    const [imgProgressValue, setImgProgressValue] = useState(0); // Image detect percent (0-100%)
    const [imgProgressColor, setImgProgressColor] = useState({ progressColor: '#FF0000' }); // Image detect progressBar color may change depends on detect percent value

    const { handleSubmit, control } = useForm(); // React-hook-form

    const [imgConfig, setImgConfig] = useState({ cmd: 'ShowOverlay', s: 2}) // Form
    
    const [imgSrc, setImgSrc] = useState(null); // Source url to image
    const [imgStat, setImgStat] = useState(''); // Statistic from image

    const classes = useStyles({ viewerWidth: '640px', viewerHeight: '430px', progressColor: imgProgressColor.progressColor }); // Global style object
     
    const [errorRefreshTime, setErrorRefreshTime] = useState(false); // Entered wrong refresh time

    // 'use timeout'
    const [timerOn, setTimerOn] = useState(commands[liveImagesTypes.START_STOP_LIVE] && commands[liveImagesTypes.START_STOP_LIVE].data); // Timer used for make repeat request
    //const {reset} = useTimeout(() => {loadImage(imgConfig)}, refreshTime, timerOn); // Reset timer

    useInterval(() => { loadImage(imgConfig) }, timerOn ? commands[liveImagesTypes.REFRESH_INTERVAL].data : null)
    const int = useInterval(() => { getCamMode() }, timerOn ? 3000 : null)

    // Parse flat object
    const parseStatistic = stat => {
        const tr = [];

        Object.keys(stat).forEach(key => {
            tr.push(<tr key={`tr_${key}`}><td key={`td1_${key}`}>{key}</td><td key={`td2_${key}`}>{stat[key]}</td></tr>)
            if (key === 'OBJECT_LOC.SCORE')
                setImgProgressValue(+stat[key])
            if (key === 'IMAGE_DECISION') 
                setImgProgressColor({ progressColor: +stat[key] })
        })

        return (
            <div>
                <Typography variant='h5'>Статистика рецепта:</Typography>
                <hr/>
                <table>
                    <tbody>
                        {tr}
                    </tbody>
                </table>
                {
                    commonCommands[commonCommandsTypes.CAM_MODE].data? 
                    <>
                        <Typography className={classes[commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1? 'warningColorText' : 'successColorText']} variant="h4">
                            Текущий режим - {commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1? 'EDIT MODE' : 'RUN MODE'}
                        </Typography>
                        {
                            commonCommands[commonCommandsTypes.SAVE_TO_FLASH].loading && <Typography className={classes['warningColorText']} variant="h4">Сохранение...</Typography>
                        }
                    </>
                    : null
                }
            </div>
        )
    }

    useEffect(() => {
        setRefreshRate(150)
    }, [])

    useEffect(() => {
        setTimerOn(!commands[liveImagesTypes.START_STOP_LIVE].data)
    }, [commands[liveImagesTypes.START_STOP_LIVE].data])

    useEffect(() => {
        if (commands[liveImagesTypes.GET_LIVE_IMAGE].data)
            setImgSrc(commands[liveImagesTypes.GET_LIVE_IMAGE].data.img)
        if (commands[liveImagesTypes.GET_LIVE_STATISTIC].data)
            setImgStat(parseStatistic(commands[liveImagesTypes.GET_LIVE_STATISTIC].data.stat, false)) 
    }, [commands[liveImagesTypes.GET_LIVE_IMAGE].data, commands[liveImagesTypes.GET_LIVE_IMAGE].data, commands[liveImagesTypes.GET_LIVE_STATISTIC].data])
    
    const handleOverlay = (event, newOverlay) => {
        if (newOverlay !== null) { setImgConfig({ ...imgConfig, cmd: newOverlay}); }
    };

    return(
        <div className={classes.container}>
            <Notifier commands={commands}/>
            <div className={classes.viewer}>
                    <div className={classes.camImage}>
                        <StyledViewerImage
                            //cover
                            color={'black'}
                            errorIcon={
                                <Alert variant="filled" severity="error">
                                    <h4 id="transition-modal-title">ВНИМАНИЕ!</h4>
                                    <p id="transition-modal-description">Произошла ошибка во время загрузки изображения. Пожалуйста, попробуйте обновить изображение, либо проверьте соединение с камерой.</p>
                                </Alert>  
                            }
                            // iconContainerStyle={{
                            //     display: 'flex',
                            //     backgroundColor: 'white'
                            // }}
                            aspectRatio={1.4}
                            imageStyle={{
                                width: '100%',
                                height: '415px',
                            }}
                            disableSpinner
                            src={imgSrc || ''}
                        />
                    </div>
                    <div className={classes.camStat}>
                        {imgStat}
                    </div>
                    <BorderLinearProgress 
                        classes={{bar: classes[imgProgressColor.progressColor == 2? 'barColorPrimaryOk' : 'barColorPrimaryBad']}}
                        variant='determinate' 
                        value={imgProgressValue} 
                    />
            </div> 
            <StyledAccordion TransitionProps={{ unmountOnExit: true }}>
                <StyledAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Дополнительные настройки</Typography>
                </StyledAccordionSummary>
                <AccordionDetails>
                    <form className={classes.flexContainer} onSubmit={handleSubmit((e) => setRefreshRate(e.refreshtime))}>
                        <FormControl fullWidth className={classes.margin} variant="outlined" color="secondary" size="small">
                            <Controller
                                name="refreshtime"
                                as={
                                    <StyledTextField
                                        className={classes.textField}
                                        InputProps={{ 
                                        inputProps: 
                                            { min: 100, max: 10000 },
                                        classes: {
                                            input: classes.resize,
                                        }, 
                                        }}
                                        error={errorRefreshTime}
                                        id="standard-error-helper-text"
                                        label="Частота обновления изображений (мс):"
                                        helperText={errorRefreshTime ? 'T > 100 мс' : null}
                                        disabled={!commands[liveImagesTypes.START_STOP_LIVE].data}
                                    />
                                }
                                control={control}
                                defaultValue={150}
                                rules={{
                                    validate: data => {
                                        data < 100 ? setErrorRefreshTime(true) : setErrorRefreshTime(false)
                                    }
                                }}
                            />
                        </FormControl>
                        <StyledToggleButton
                            type='submit'
                            className={classes.toggleButton}
                            value="check"
                            selected={commands[liveImagesTypes.START_STOP_LIVE].data}
                            onChange={() => {
                                //setTimerOn(!commands[liveImagesTypes.START_STOP_LIVE].data) 
                                startStopLive(!commands[liveImagesTypes.START_STOP_LIVE].data)
                            }}
                            disabled={errorRefreshTime}
                        >
                            {!commands[liveImagesTypes.START_STOP_LIVE].data? <PauseIcon /> : <PlayArrowIcon />}
                        </StyledToggleButton>
                    </form>
                    <div className={classes.flexContainer}>
                        <SelectOverlay
                            value={imgConfig.cmd}
                            onChange={handleOverlay}
                            classes={classes}
                            disabled={!commands[liveImagesTypes.START_STOP_LIVE].data}
                        />
                    </div>
                </AccordionDetails>
            </StyledAccordion>      
        </div>
    )
}

export default CamViewer