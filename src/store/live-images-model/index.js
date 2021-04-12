import { thunk, action } from 'easy-peasy';
import nestedObjectsUtil from 'nested-objects-util';
import commandService from 'Services/api/commandService';
import actionTypes from '../actionTypes';
const {liveImagesTypes} = actionTypes

const liveImagesModel = {
    commands: {},
    setInitialCommandsState: thunk(async (actions, payload, { getState }) => {
        let newCommands = {}
        Object.keys(liveImagesTypes).forEach(comm => {
            if (comm === liveImagesTypes.LIVE_IMAGE_FAIL) {
                newCommands[comm] = {
                    data: [],
                    error: null,
                    loading: false
                }
            } else {
                newCommands[comm] = {
                    data: null,
                    error: null,
                    loading: false
                }
            }
        })
        actions.initCommands(newCommands)
    }),
    initCommands: action((state, payload) => {
        state.commands = {...state.commands, ...payload}
    }),
    startStopLive: thunk((actions, payload) => {
        actions.loadImageStart({
            actionType: liveImagesTypes.START_STOP_LIVE
        });
        actions.loadImageSuccess({
            actionType: liveImagesTypes.START_STOP_LIVE, 
            data: payload
        });
    }),
    loadImage: thunk(async (actions, payload, {getState}) => { 
        // if (getState().commands[liveImagesTypes.GET_LIVE_IMAGE].loading || getState().commands[liveImagesTypes.GET_LIVE_STATISTIC].loading)
        //     return

        const liveImageObject = { img: null, stat: null }
        payload = { id: `ID_${new Date().getTime()}`, ...payload }; 

        actions.loadImageStart({
            actionType: liveImagesTypes.GET_LIVE_IMAGE
        }); 

        commandService.getLiveImage(payload)
        .then(response => {
            liveImageObject.img = response
            actions.loadImageSuccess({
                actionType: liveImagesTypes.GET_LIVE_IMAGE, 
                data: { img: liveImageObject.img }
            });
            actions.loadImageStart({
                actionType: liveImagesTypes.GET_LIVE_STATISTIC
            });
            return commandService.getLiveStatistic(payload)
        })
        .then(response => {
            if (response){
                console.log(response)
                const statObj = nestedObjectsUtil.flatten(response.MESSAGE);
                liveImageObject.stat = statObj
                actions.loadImageSuccess({
                    actionType: liveImagesTypes.GET_LIVE_STATISTIC, 
                    data: { stat: statObj }
                });
                if (parseInt(statObj['IMAGE_DECISION'], 10) < 2)
                    actions.processImages({
                        actionType: liveImagesTypes.LIVE_IMAGE_FAIL,
                        data: liveImageObject
                    })
            } else {
                actions.loadImageSuccess({
                    actionType: liveImagesTypes.GET_LIVE_STATISTIC, 
                    data: { stat: {'СТАТИСТИКА ОТСУТСТВУЕТ!': ''} }
                });
            }
        })
        .catch(error => {
            console.error('Error', error)
            actions.loadImageFail({
                actionType: liveImagesTypes.GET_LIVE_IMAGE,
                error: error.message || error
            });
            actions.loadImageFail({
                actionType: liveImagesTypes.GET_LIVE_STATISTIC,
                error: error.message || error
            });

            //actions.loadImage(payload)
        })
    }),
    processImages: thunk(async (actions, payload, {getState}) => {
        let statis = ''
        for (var p in payload.data.stat) {
            if (payload.data.stat.hasOwnProperty(p)) {
                statis += p + ' : ' + payload.data.stat[p] + '\n';
            }
        }
        let failImages = getState().commands[liveImagesTypes.LIVE_IMAGE_FAIL].data;

        if (failImages.length >= 30) 
            failImages.shift()

        failImages.push({
            original: payload.data.img, 
            thumbnail: payload.data.img,
            statistic: statis,
            description: statis
        })

        actions.loadImageSuccess({
            actionType: liveImagesTypes.LIVE_IMAGE_FAIL, 
            data: failImages
        })
    }),
    loadImageStart: action((state, payload) => {
        state.commands = Object.assign({}, 
            state.commands, {...state.commands, [payload.actionType]: { ...state.commands[payload.actionType], 
                //error: false, 
                loading: true 
            } }
        );
    }),
    loadImageSuccess: action((state, payload) => {
        state.commands = Object.assign({}, 
            state.commands, 
            {...state.commands, [payload.actionType]: { data: payload.data, error: false, loading: false } }
        );
    }),
    loadImageFail: action((state, payload) => {
        state.commands = Object.assign({}, 
            state.commands, 
            {...state.commands, [payload.actionType]: { ...state.commands[payload.actionType], error: payload.error, loading: false }}
        );
    }),
}

export default liveImagesModel