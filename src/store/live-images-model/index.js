import { thunk, action } from 'easy-peasy';
import _ from 'lodash';
import flatten  from 'flat';
import commandService from 'Services/api/commandService';
import { handlePromise } from 'Utils/data-utils';
import actionTypes from '../actionTypes';
const {liveImagesTypes, commonCommandsTypes} = actionTypes

const liveImagesModel = {
    commands: {},
    setInitialCommandsState: thunk(async (actions, payload, { getState, getStoreActions }) => {
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
        getStoreActions().commonCommands.setInitialCommandsState()
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
    setRefreshRate: thunk(async (actions, payload) => {
        actions.loadImageSuccess({
            actionType: liveImagesTypes.REFRESH_INTERVAL, 
            data: payload
        });
    }),
    loadImage: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => { 
        if (getStoreState().commonCommands.commands[commonCommandsTypes.CAM_MODE].data 
        && getStoreState().commonCommands.commands[commonCommandsTypes.CAM_MODE].data.mode == 1) {
            actions.setRefreshRate(10000)
            //return
        } else {
            actions.setRefreshRate(150)
        }  

        if (getState().commands[liveImagesTypes.GET_LIVE_IMAGE].loading || getState().commands[liveImagesTypes.GET_LIVE_STATISTIC].loading) {
            //setRefreshRate(1000)
            return
        }

        const payloadData = {...payload, id: `ID_${new Date().getTime()}`, img: null, stat: null}

        actions.loadImageStart({
            actionType: liveImagesTypes.GET_LIVE_IMAGE
        }); 

        const [liveImage, liveImageErr] = await handlePromise(commandService.getLiveImage(payloadData));      
        if (liveImageErr){
            actions.loadImageFail({
                actionType: liveImagesTypes.GET_LIVE_IMAGE,
                error: liveImageErr
            });
            return
        } else {
            payloadData.img = liveImage
            console.log('LiveImage Data', liveImage)
            actions.loadImageSuccess({
                actionType: liveImagesTypes.GET_LIVE_IMAGE, 
                data: { img: payloadData.img }
            });
        }

        actions.loadImageStart({
            actionType: liveImagesTypes.GET_LIVE_STATISTIC
        });

        const [liveImageStat, liveImageStatErr] = await handlePromise(commandService.getLiveStatistic(payloadData));
        if (liveImageStatErr) { 
            actions.loadImageSuccess({
                actionType: liveImagesTypes.GET_LIVE_STATISTIC, 
                data: { stat: {'СТАТИСТИКА ОТСУТСТВУЕТ!': ''} }
            });
            return
        } else if (liveImageStat && liveImageStat['MESSAGE']){
            _.flow([
                Object.entries,
                arr => arr.map(([key, value]) => [key, Number(value)]),
                Object.fromEntries,
                statObj => {
                    const sts = getState().commands.GET_LIVE_STATISTIC.data
                    payloadData.stat = statObj
                    if (sts && statObj['IMAGE_NUMBER'] !== sts['IMAGE_NUMBER']) {
                        actions.processImages({
                            actionType: liveImagesTypes.LIVE_IMAGE_FAIL,
                            data: payloadData
                        })
                    }
                    console.log('payloadData', payloadData)
                    actions.loadImageSuccess({ actionType: liveImagesTypes.GET_LIVE_STATISTIC,  data: payloadData })
                },
            ])(flatten(liveImageStat.MESSAGE));
        } else {
            actions.loadImageSuccess({
                actionType: liveImagesTypes.GET_LIVE_STATISTIC, 
                data: { stat: {'СТАТИСТИКА ОТСУТСТВУЕТ!': ''} }
            }); 
        }
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