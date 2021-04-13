import { thunk, action } from 'easy-peasy';
//import {Promise as BBPromise} from 'bluebird';
import commandService from 'Services/api/commandService';
import actionTypes from '../actionTypes';
const {logImagesTypes, liveImagesTypes} = actionTypes

const logImagesModel = {
    commands: {},
    commandIsLoadingStart: action((state, payload) => {
        console.log('START COMMAND', payload.actionType)
        state.isLoading = true
        state.isError = false
        state.commands = {...state.commands, [payload.actionType]: { ...state.commands[payload.actionType], error: false, loading: true } }
    }),
    commandIsLoadingSuccess: action((state, payload) => {
        console.log('SUCCESS COMMAND', payload.actionType)
        console.log('DATA', payload.data)
        state.isLoading = false
        state.isError = false
        state.commands = {...state.commands, [payload.actionType]: { data: payload.data, error: false, loading: false } }
    }),
    commandIsLoadingFail: action((state, payload) => {
        console.log('FAIL COMMAND', payload.actionType)
        console.error('ERROR', payload.error)
        state.isLoading = false
        state.isError = true
        state.commands = {...state.commands, [payload.actionType]: { data: state.commands[payload.actionType].data, error: !!payload.error, loading: false } }
    }),
    clearLogImages: action(state => {
        state.logImages.splice(0, state.logImages.length)
    }),
    setInitialCommandsState: thunk(async (actions, payload, { getState }) => {
        let newCommands = {}
        Object.keys(logImagesTypes).forEach(comm => {
            newCommands[comm] = {
                data: null,
                error: null,
                loading: true
            }
        })
        actions.initCommands(newCommands)
    }),
    initCommands: action((state, payload) => {
        state.commands = {...state.commands, ...payload}
    }),
    updateLogImages: thunk(async (actions, payload, {meta}) => {
        //actions.clearLogImages()
        actions._loadLogImages({...payload, action: meta});
    }),
    loadLogImages: thunk(async (actions, payload, {meta}) => {
        //actions.clearLogImages()
        actions._loadLogImages({...payload, action: meta});
    }),
    checkLockUnlock: thunk(async (actions, payload) => {
        const { action } = payload
        console.log('META', action.key !== 'loadLogImages')
        if (action.key !== 'loadLogImages') {
            actions.commandIsLoadingStart(
                {
                    actionType: logImagesTypes.UNLOCK_LOG
                }
            )
            commandService.unlockLogImages()
            .then(response => {
                actions.commandIsLoadingSuccess(
                    {
                        actionType: logImagesTypes.UNLOCK_LOG,
                        data: true
                    }
                )
            })
            .catch(error => {
                console.error(error)
                actions.commandIsLoadingFail(
                    {
                        actionType: logImagesTypes.UNLOCK_LOG,
                        error: error || error.message
                    }
                )
            })
        }
    }),
    _loadLogImages: thunk(async (actions, payload, {getStoreState, getStoreActions}) => {
        const { count, cmd, size, type, action } = payload

        actions.commandIsLoadingStart(
            {
                actionType: logImagesTypes.LOAD_IMAGE
            }
        )

        if (type == 'camLog') {

            getStoreActions().liveImages.startStopLive(true)

            actions.commandIsLoadingStart(
                {
                    actionType: logImagesTypes.LOCK_LOG
                }
            )

            commandService.lockLogImages()
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: logImagesTypes.LOCK_LOG,
                    data: true
                }
            )

            return new Promise(resolve => resolve(response))
        })
        .then(response => {
            const logImagesArr = []
            for (let id = 0; id < count; id++){
                logImagesArr.push(commandService.loadLogImage({id, cmd}));
            }
            return new Promise(resolve => resolve(logImagesArr))
        })
        .then(images => {
            Promise.all(images)
            .then(function(result) {
                getStoreActions().liveImages.startStopLive(false)
                // This will run after the last step is done
                actions.commandIsLoadingSuccess(
                    {
                        actionType: logImagesTypes.LOAD_IMAGE,
                        data: {liveImageLog: [{original: '', thumbnail: ''}], camLog: result.map(img => {return {original: img, thumbnail: img}})}
                    }
                )
                actions.checkLockUnlock(payload)
            })
            .catch(function(error) {
                console.error(error)
                getStoreActions().liveImages.startStopLive(false)
                actions.commandIsLoadingFail(
                    {
                        actionType: logImagesTypes.LOAD_IMAGE,
                        error: error || error.message
                    }
                )
                actions.commandIsLoadingFail(
                    {
                        actionType: logImagesTypes.LOCK_LOG,
                        error: error || error.message
                    }
                )
                actions.checkLockUnlock(payload)
            });
        })
        .catch(error => {
            console.error(error)
            getStoreActions().liveImages.startStopLive(false)
            actions.commandIsLoadingFail(
                {
                    actionType: logImagesTypes.LOAD_IMAGE,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: logImagesTypes.LOCK_LOG,
                    error: error || error.message
                }
            )
            actions.checkLockUnlock(payload)
        })

        } else if (type == 'liveImageLog'){
            const arr = [...getStoreState().liveImages.commands[liveImagesTypes.LIVE_IMAGE_FAIL].data]
            actions.commandIsLoadingSuccess(
                {
                    actionType: logImagesTypes.LOAD_IMAGE,
                    data: {liveImageLog: arr, camLog: [{original: '', thumbnail: ''}]} 
                }
            )
        }
    }),
}

export default logImagesModel