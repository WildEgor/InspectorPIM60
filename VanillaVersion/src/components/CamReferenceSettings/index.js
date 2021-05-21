import React, { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory, withRouter } from 'react-router-dom';
//import MenuBar from 'Components/MenuBar';
import Spinner from 'Components/Spinner';
import { useStyles } from 'Style/components';
import ObjectLocatorForm from 'Components/CamReferenceSettings/ObjectLocatorForm';
import PixelCounterForm from 'Components/CamReferenceSettings/PixelCounterForm';
import EdgeCounterForm from 'Components/CamReferenceSettings/EdgeCounterForm';
import PatternForm from 'Components/CamReferenceSettings/PatternForm';
import { v4 as uuidv4 } from 'uuid';
import CamTabs from 'Components/CamTabs';
//import Notifier from 'Components/Notifier';
//import menuItems from 'Components/MenuBar/menuItems';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';
import actionTypes from 'Store/actionTypes';
const {commonCommandsTypes} = actionTypes

const CamReferenceSettings = (props) => {

    const history = useHistory();
    const { uid, onUpdate } = props
    const classes = useStyles()

    //const enqueueSnackbar = useStoreActions(actions => actions.notifyController.enqueueSnackbar)

    const commands = useStoreState(state => state.commonCommands.commands)
    const changeCamMode = useStoreActions(actions => actions.commonCommands.changeCamMode)
    const getAvailableTools = useStoreActions(actions => actions.commonCommands.getAvailableTools)

    const [links, setLinks] = useState(
        [
            {
                url: `camreference.html`,
                name: ``,
                component: [<Spinner key={uuidv4()}/>],
            }
        ]
    )

    const checkCommands = () => {
        let arrayLinks = []
            for (let prop in commands[commonCommandsTypes.AVAILABLE_TOOLS].data){
                let propName = 'Empty'
                let isDisabled = true
                let components = [];
                commands[commonCommandsTypes.AVAILABLE_TOOLS].data[prop].forEach((item, i) => {
                    switch (true) {
                        case item.name.startsWith('object_locator'):
                            propName = 'Object Locator'
                            isDisabled = false
                            components.push(
                                <ObjectLocatorForm
                                    key={uuidv4()}
                                    uid={item.id}
                                    formName={item.name}
                                    onUpdate={onUpdate}
                                />
                            )
                        break;
                        case item.name.startsWith('pixel_counter'):
                            propName = 'Pixel Counter'
                            isDisabled = false
                            components.push(
                                <PixelCounterForm
                                    key={uuidv4()}
                                    uid={item.id}
                                    formName={item.name}
                                    onUpdate={onUpdate}
                                />
                            )
                        break;
                        case item.name.startsWith('edge_pixel_counter'):
                            propName = 'Edge Pixel Counter'
                            isDisabled = false
                            components.push(
                                <EdgeCounterForm
                                    key={uuidv4()}
                                    uid={item.id}
                                    formName={item.name}
                                    onUpdate={onUpdate}
                                />
                            )
                        break;
                        case item.name.startsWith('pattern'):
                            propName = 'Pattern'
                            isDisabled = false
                            components.push(
                                <PatternForm
                                    key={uuidv4()}
                                    uid={item.id}
                                    formName={item.name}
                                    onUpdate={onUpdate}
                                />
                            )
                        break;
                        default:
                            isDisabled = false 
                            components.push(
                                <div><h3>Данный инструмент не найден.</h3></div>
                            )
                        break;
                    }
                })
                arrayLinks.push({
                    url: `camreference.html/${prop}`,
                    name: propName,
                    component: components,
                    isDisabled
                })
            }
        setLinks(arrayLinks)
    }

    useEffect(() => {
        getAvailableTools(uid)
        .then(() => {
            changeCamMode({mode: 1, save: false})
        })
        return () => {
            //changeCamMode({mode: 0})
            history.push('/camreference.html');
        }
    }, [])

    useEffect(() => {
        if (commands[commonCommandsTypes.AVAILABLE_TOOLS].data !== null)
            checkCommands()
    }, [commands[commonCommandsTypes.AVAILABLE_TOOLS].data])

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
            {
                commands[commonCommandsTypes.AVAILABLE_TOOLS].loading? 
                <Spinner/>
                :
                <>
                {
                    commands[commonCommandsTypes.AVAILABLE_TOOLS].error? 
                    <CloseSharpIcon/>
                    :
                    <CamTabs links={links} disabled={false}/>
                }
                </>
            }
        </div>    
    )
}

export default withRouter(CamReferenceSettings)