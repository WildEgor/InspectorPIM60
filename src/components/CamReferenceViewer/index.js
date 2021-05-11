import React, { useState, useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import UpdateIcon from '@material-ui/icons/Update';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';
import Alert from '@material-ui/lab/Alert';
import Notifier from 'Components/Notifier';

import { useStoreActions, useStoreState } from 'easy-peasy';
import {refreshPage} from 'Store';
import { useForm, Controller } from "react-hook-form";

import CamReferenceSettings from '../CamReferenceSettings';
import Spinner from '../Spinner';

import { BrowserRouter as Router } from 'react-router-dom'

import actionTypes from 'Store/actionTypes';
const {referenceImagesTypes, commonCommandsTypes} = actionTypes

import {
    useStyles, 
    StyledButton, 
    StyledSelector, 
    StyledViewerImage,
    StyledIconButton} from 'Style/components';
import { Typography } from '@material-ui/core';

const CamReferenceViewer = () => {
    //const enqueueSnackbar = useStoreActions(actions => actions.notifyController.enqueueSnackbar)
    const [showRecipe, setShowRecipe] = useState(true);
    const [showModalWindow, setShowModalWindow] = useState(false)
    const [showSaveToFlashModal, setShowSaveToFlashModal] = useState(false)
    const [showNestedSettings, setShowNestedSettings] = useState(false)

    const classes = useStyles({show: showRecipe});
    
    const changeActiveReferenceImage = useStoreActions(actions => actions.referenceImages.changeActiveReferenceImage)
    const changeCamMode = useStoreActions(actions => actions.commonCommands.changeCamMode)
    const updateReferenceImages = useStoreActions(actions => actions.referenceImages.updateReferenceImages)
    const commands = useStoreState(state => state.referenceImages.commands)
    const commonCommands = useStoreState(state => state.commonCommands.commands)

    const [referenceNumber, setReferenceNumber] = useState(1);

    useEffect(() => {
        setReferenceNumber(commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].data + 1)
    }, [commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].data])

    const { handleSubmit, reset, setValue, control } = useForm();

    const onSubmitObject = e => {
        const id = parseInt(e.changereferenceobject, 10) - 1
        changeActiveReferenceImage({id})
        updateReferenceImages()
    }

    useEffect(() => {
        console.log(commands)
        updateReferenceImages()
        return () => {
            refreshPage()
        };
    }, [])

    useEffect(() => {
        setValue("changereferenceobject", referenceNumber)
        reset({["changereferenceobject"]: referenceNumber})
    }, [referenceNumber])

    const updateReferenceViewer = () => { updateReferenceImages()}

    // const notify = (variant, msg) => {
    //     enqueueSnackbar({
    //         message: {
    //             ...msg,
    //             variant
    //         },
    //         options: {
    //             key: new Date().getTime() + Math.random(),
    //             variant,
    //             preventDuplicate: true,
    //             persist: true,
    //         },
    //     });
    // }

    // useEffect(() => {
    //     for (const [key, value] of Object.entries(commands)) {
    //         if (value.error) notify('error', { m: `Произошла ошибка команды - ${key}`, e: value.error, d: ''})
    //     }
    // }, [commands])

    return(
        <div className={classes.container}>
            <Notifier commands={{...commands, ...commonCommands}}/>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={ showModalWindow }
                onClose={(e, r) => { setShowModalWindow(false) }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={ showModalWindow }>
                    <Alert variant="filled" severity="warning" className={classes.blackText}>
                    <Typography align="center" color="primary" variant="h4">ВНИМАНИЕ!</Typography>
                    {
                        (commonCommands[commonCommandsTypes.CAM_MODE].data && commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1)?
                            <Typography align="center" color="primary" variant="h5">Камера в <b>EDIT MODE</b>. Что делаем?</Typography>
                            : <Typography align="center" color="primary" variant="h5">Камера будет переведена в <b>EDIT MODE</b>. Вы уверены?</Typography>

                    }
                        <div className={classes.flexContainer}>
                            <StyledButton 
                                onClick={ () => { 
                                    setShowNestedSettings(true)
                                    setShowModalWindow(false)
                            }
                            }>
                                <Typography variant="h5">Открыть настройки</Typography>
                            </StyledButton>
                            {
                                (commonCommands[commonCommandsTypes.CAM_MODE].data && commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1) && 
                                <StyledButton 
                                        onClick={ () => {
                                            changeCamMode({mode: 0, save: false})
                                            updateReferenceImages()
                                            setShowModalWindow(false)
                                    }
                                    }>
                                    <Typography variant="h5">Перевести в RUN</Typography>
                                </StyledButton>
                            }
                            <StyledIconButton
                                color='secondary'
                                onClick={() => setShowModalWindow(false)}
                            >
                                <CloseSharpIcon />
                            </StyledIconButton>
                        </div>
                    </Alert>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title-savetoflash"
                aria-describedby="transition-modal-description-savetoflash"
                className={classes.modal}
                open={ showSaveToFlashModal }
                onClose={(e, r) => { setSaveToFlashModal(false) }}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={ showSaveToFlashModal }>
                    <Alert variant="filled" severity="warning" className={classes.blackText}>
                        <Typography align="center" color="primary" variant="h4">ВНИМАНИЕ!</Typography>
                        <Typography align="center" color="primary" variant="h5">Выберите действие</Typography>
                        <div className={classes.flexContainer}>
                            <StyledButton 
                                onClick={ () => { 
                                    //setShowNestedSettings(false); 
                                    changeCamMode({mode: 1, save: true}) 
                                    setShowSaveToFlashModal(false)
                                }
                            }>
                                <Typography variant="h5">Сохранить настройки</Typography>
                            </StyledButton>
                            <StyledButton onClick={() => {  
                                changeCamMode({mode: 0, save: false}) 
                                setShowSaveToFlashModal(false)
                                setShowNestedSettings(false)
                            }}>
                                <Typography variant="h5">Выйти из настроек</Typography>
                            </StyledButton>
                            <StyledButton
                                onClick={() => setShowSaveToFlashModal(false)}
                            >
                                <Typography variant="h5">Свернуть окно</Typography>
                            </StyledButton>
                        </div>
                    </Alert>
                </Fade>
            </Modal>
            <div className={classes.viewer}>
                {(commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].data === null)? 
                <>
                    {(commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].loading || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].loading || commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].loading) && <Spinner/>}
                </>: 
                <>
                    <div className={classes.camImage}>
                        <StyledViewerImage
                            aspectRatio={1.4}
                            color={'black'}
                            // errorIcon={
                            //     <div className={classes.container}>
                            //         <div className={classes.flexContainer}>
                            //             <p>Произошла ошибка во время загрузки рецептов. 
                            //             Пожалуйста, подождите или нажмите кнопку "Обновить".</p>
                            //         </div>
                            //     </div>
                            // }
                            imageStyle={{
                                width: '640px',
                                height: '480px'
                            }}
                            src={commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].data[referenceNumber - 1] || ''}
                        />
                    </div>
                    <div className={classes.camStat}>
                        <div>
                            {
                                <>
                                    <Typography variant="h5">{((referenceNumber - 1) === commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].data)? `Активный рецепт` : 'Не активный рецепт' }</Typography>
                                    {
                                        commonCommands[commonCommandsTypes.CAM_MODE].data? 
                                        <>
                                            <Typography className={classes[commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1? 'warningColorText' : 'successColorText']} variant="h4">
                                                Текущий режим - {commonCommands[commonCommandsTypes.CAM_MODE].data.mode == 1? 'EDIT MODE' : 'RUN MODE'}
                                            </Typography>
                                            {
                                                commonCommands[commonCommandsTypes.SAVE_TO_FLASH].loading && <Typography className={classes['warningColorText']} variant="h4">Идет сохранение...</Typography>
                                            }
                                        </>
                                        : null
                                    }
                                </>
                            }   
                        </div>
                    </div>
                </>
                }
                    <button
                        className={classes.settingsButton} 
                        onClick={() => {setShowRecipe(!showRecipe)}}
                    />
            </div> 
            <div className={classes.settings}>
                <form className={classes.flexContainer} onSubmit={handleSubmit(onSubmitObject)}>
                        <FormControl fullWidth className={classes.margin} variant="outlined" size="small">
                            <Controller
                                name="changereferenceobject"
                                render={({onChange}) => {
                                    const obj = []
                                    for (let i = 1; i <= commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].data; i++) {
                                        obj.push(<MenuItem key={`MenuItem_${i}`} value={i}>Рецепт №{i}</MenuItem>);
                                    }
                                    
                                    return (
                                        <StyledSelector
                                            labelId="change-reference-object"
                                            id="change-reference-object"
                                            value={referenceNumber}
                                            onChange={(e) => {
                                                    setReferenceNumber(e.target.value);
                                                    onChange(e.target.value)
                                                    console.log(e.target.value)
                                                }
                                            }
                                                disabled={showNestedSettings 
                                                || (commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].loading 
                                                || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].loading 
                                                || commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].loading)}
                                        >
                                            {obj}
                                        </StyledSelector>
                                    )
                                }}
                                control={control}
                                defaultValue={1}
                            />
                        </FormControl>
                        <StyledIconButton
                            color='secondary'
                            type='submit'
                            disabled={showNestedSettings
                            || (commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].error 
                            || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].error 
                            || commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].error)
                            || (commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].loading 
                            || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].loading 
                            || commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].loading)}
                        >
                            <SaveIcon />
                        </StyledIconButton>
                        <StyledIconButton
                            color='secondary'
                            onClick={() => { 
                                if ( !showNestedSettings) {
                                    setShowModalWindow(true) 
                                } else {
                                    setShowSaveToFlashModal(true)
                                    //setShowNestedSettings(false)
                                }
                            }}
                            disabled={
                                (commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].error 
                            || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].error 
                            || commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].error)
                            || (commands[referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS].loading 
                            || commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].loading 
                            || commands[referenceImagesTypes.ACTIVE_REFERENCE_OBJECT].loading)
                            || ((referenceNumber - 1) !== commands[referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT].data)
                            }
                            >
                            {!showNestedSettings? <SettingsIcon /> : <CloseSharpIcon/>}
                        </StyledIconButton> 
                        <StyledIconButton
                            color='secondary'
                            onClick={() => updateReferenceViewer()}
                            //disabled={}
                        >
                            <UpdateIcon />
                        </StyledIconButton>
                    </form> 
            {showNestedSettings && <Router><CamReferenceSettings onUpdate={updateReferenceImages} uid={(referenceNumber - 1)}/></Router>}
            </div>    
        </div>
    )
}

export default CamReferenceViewer