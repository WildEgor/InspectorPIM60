import { thunk, action } from 'easy-peasy';
import {Promise as BBPromise} from 'bluebird';
import commandService from 'Services/api/commandService';
import actionTypes from '../actionTypes';
const {referenceImagesTypes} = actionTypes

const referenceImagesModel = {
    commands: {},
    setInitialCommandsState: thunk(async actions => {
        let newCommands = {}
        Object.keys(referenceImagesTypes).forEach(comm => {
            newCommands[comm] = {
                data: null,
                error: false,
                loading: false
            }
        })
        actions.initCommands(newCommands)
    }),
    initCommands: action((state, payload) => {
        state.commands = {...state.commands, ...payload}
    }),
    updateReferenceImages: thunk(async (actions, payload, { getState, getStoreActions }) => {
        let countReferenceImages = null
        let currentNumberReferenceImage = null

        actions.commandIsLoadingStart({
            actionType: referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS
        })

        commandService.getCountActiveReferenceObject()
        .then(response => { 
            countReferenceImages = response[0]
            actions.commandIsLoadingSuccess({
                actionType: referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS,
                data: response[0]
            })
            actions.commandIsLoadingStart({
                actionType: referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT
            })
            return commandService.getNumberActiveReferenceObject()
        })
        .then(response => {
            currentNumberReferenceImage = response[0]
            actions.commandIsLoadingSuccess({
                actionType: referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT,
                data: response[0],
            })
            return getStoreActions().commonCommands.getCamMode()
        })
        .then(() => {
            actions.getReferenceImages({values: [currentNumberReferenceImage, countReferenceImages]})
        })
        .catch(error => {
            actions.commandIsLoadingFail({
                actionType: referenceImagesTypes.COUNT_ACTIVE_REFERENCE_OBJECTS,
                error: error || error.message
            })
            actions.commandIsLoadingFail({
                actionType: referenceImagesTypes.NUMBER_ACTIVE_REFERENCE_OBJECT,
                error: error || error.message
            })
        })
    }),
    getReferenceImages: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart({
            actionType: referenceImagesTypes.ACTIVE_REFERENCE_OBJECT
        })
        actions.commandIsLoadingStart({
            actionType: referenceImagesTypes.REFERENCE_OBJECT
        })

        const responses = {  images: [] }

        console.log('CUR, ALL', payload.values[0], payload.values[1]);

        for (let i = 0; i < payload.values[1]; i++) {
            const request = (i == payload.values[0])? commandService.getActiveReferenceObject() : commandService.getReferenceObject({id: i})
            //const request = commandService.getReferenceObject({id: i})
            //const getName = `/CmdChannel?gSTR_2_${i}`
            responses.images.push(request)
        }

        BBPromise.all(responses.images)
        .then(function(responses) {
            actions.commandIsLoadingSuccess({
                actionType: referenceImagesTypes.ACTIVE_REFERENCE_OBJECT,
                data: responses,
            })
            actions.commandIsLoadingSuccess({
                actionType: referenceImagesTypes.REFERENCE_OBJECT,
                data: responses,
            })
        })
        .catch(function(error) {
            actions.commandIsLoadingFail({
                actionType: referenceImagesTypes.ACTIVE_REFERENCE_OBJECT,
                error: error || error.message
            })
            actions.commandIsLoadingFail({
                actionType: referenceImagesTypes.REFERENCE_OBJECT,
                error: error || error.message
            })
        });
    }),
    changeActiveReferenceImage: thunk(async (actions, payload) => {
        actions.commandIsLoadingStart({
            actionType: referenceImagesTypes.SET_ACTIVE_REFERENCE_OBJECT
        })

        commandService.setReferenceObject({id: (payload.id)})
        .then(response => {
            actions.commandIsLoadingSuccess({
                actionType: referenceImagesTypes.SET_ACTIVE_REFERENCE_OBJECT,
                data: response
            })
        })
        .catch(error => {
            console.debug(error);
            actions.commandIsLoadingFail({
                actionType: referenceImagesTypes.SET_ACTIVE_REFERENCE_OBJECT,
                error: error || error.message
            })
        })
    }),
    commandIsLoadingStart: action((state, payload) => {
        state.commands = {...state.commands, [payload.actionType]: { ...state.commands[payload.actionType], error: false, loading: true} }
    }),
    commandIsLoadingSuccess: action((state, payload) => {
        state.commands = {...state.commands, [payload.actionType]: { data: payload.data, error: false, loading: false } }
    }),
    commandIsLoadingFail: action((state, payload) => {
        state.commands = {...state.commands, [payload.actionType]: { ...state.commands[payload.actionType], error: payload.error, loading: false} }
    }),
}

export default referenceImagesModel