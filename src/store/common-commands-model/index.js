import { thunk, action } from 'easy-peasy';
import commandService from 'Services/api/commandService';
import actionTypes from '../actionTypes';
const {commonCommandsTypes} = actionTypes

const commonCommandsModel = {
    commands: {},
    setInitialCommandsState: thunk(async actions => {
        let newCommands = {}
        Object.keys(commonCommandsTypes).forEach(comm => {
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
        state.commands = {...state.commands, [payload.actionType]: { data: payload.data, error: null, loading: false } }
    }),
    commandIsLoadingFail: action((state, payload) => {
        console.log('FAIL COMMAND', payload.actionType)
        console.error('ERROR', payload.error)
        state.isLoading = false
        state.isError = true
        state.commands = {...state.commands, [payload.actionType]: { data: payload.data, error: payload.error, loading: false } }
    }),
    saveToFlash: thunk(async actions => {
        try {
            actions.commandIsLoadingStart({
                actionType: commonCommandsTypes.SAVE_TO_FLASH
            })
            const response = await commandService.saveToFlash()
            actions.commandIsLoadingSuccess({
                actionType: commonCommandsTypes.SAVE_TO_FLASH,
                data: true
            })
        } catch (error) {
            console.error(error);
            actions.commandIsLoadingFail({
                actionType: commonCommandsTypes.SAVE_TO_FLASH,
                error: error || error.message
            })
        } finally {
            console.log('We do cleanup here');
        }

        //actions.commandIsLoadingSuccess()
    }),
    getCamStatus: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart()
        commandService.getCamStatus()
        .then((response) => {
            console.log('GetCamStatus done', response)
            actions.commandIsLoadingSuccess(
                {
                    ...payload,
                    actionType: commonCommandsTypes.GET_CAM_STATUS, 
                    data: true
                }
            )
        })
        .catch(error => {
            console.debug(error);
            actions.commandIsLoadingFail(
                {
                    ...payload,
                    actionType: commonCommandsTypes.GET_CAM_STATUS, 
                    error: error || error.message
                }
            )
        }); 
    }),
    changeCamMode: thunk(async (actions, payload, {getState}) => {
        if (payload.mode == 0 && payload.save)
            actions.saveToFlash()

        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.CAM_MODE, 
            }
        )

        commandService.setCamMode({mode: payload.mode})
        .then((response) => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.CAM_MODE, 
                    data: {mode: payload.mode}
                }
            )

        })
        .catch(error => {
            console.debug(error);
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.CAM_MODE, 
                    error: error || error.message
                }
            )
        });
    }),
    getCamMode: thunk(async actions => {
        actions.commandIsLoadingStart(
            actions.commandIsLoadingStart(
                {
                    actionType: commonCommandsTypes.CAM_MODE, 
                }
            )
        )
        commandService.getCamMode()
        .then((response) => {
            console.log('CAM MODE', response)
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.CAM_MODE, 
                    data: {mode: response}
                }
            )
        })
        .catch(error => {
            console.debug(error);
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.CAM_MODE, 
                    error: error || error.message
                }
            )
        });
    }),
    setCamMode: action((state, payload) => {
        state.camMode = payload
    }),
    getAvailableTools: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.AVAILABLE_TOOLS, 
            }
        )
        commandService.getAvailableTools(payload)
        .then(response => {
            const tools = ["Object Locator", ...response].map((tool, i) => {
                const name = tool.toLowerCase().replace(/ /g, "_")
                let id = i
                if (!name.startsWith('object_locator'))
                    id = id - 1
                return {id: id, name: name};
            }) // "Object Locator" -> "object_locator"

            const toolsState = {
                object_locator: [],
                pixel_counter: [],
                edge_pixel_counter: [],
                pattern: []
            }

            tools.forEach(item => {
                switch (true) {
                    case item.name.startsWith('object_locator'):
                        toolsState['object_locator'].push(item)
                    break;
                    case item.name.startsWith('pixel_counter'):
                        toolsState['pixel_counter'].push(item)
                    break;
                    case item.name.startsWith('edge_pixel_counter'):
                        toolsState['edge_pixel_counter'].push(item)
                    break;
                    case item.name.startsWith('pattern'):
                        toolsState['pattern'].push(item)
                    break;
                } 
            })

            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.AVAILABLE_TOOLS, 
                    data: toolsState
                }
            )
        })
        .catch(error => {
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.AVAILABLE_TOOLS, 
                    error: error || error.message
                }
            )
        })
    }),
    setObjLocMatchThreshold:  thunk(async (actions, payload) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
            }
        )
        commandService.setObjLocMatchThreshold(payload)
        .then(r => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
                    data: payload
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
                    error: error || error.message
                }
            )
            actions.getObjLocMatchThreshold()
        })
    }),
    getObjLocMatchThreshold: thunk(async (actions) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
            }
        )

        commandService.getObjLocMatchThreshold()
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
                    data: response[0]
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.OBJECT_MATCH_THRESHOLD, 
                    error: error || error.message
                }
            )
        })
    }),
    getPixelCounterForm: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.ROI_SIZE, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
            }
        )

        commandService.getROISize(payload.id)
        .then(response => {
            if (response[0] > 0){
                actions.commandIsLoadingSuccess(
                    {
                        actionType: commonCommandsTypes.ROI_SIZE, 
                        data: response[0]
                    }
                )
            } else {
                actions.commandIsLoadingFail(
                    {
                        actionType: commonCommandsTypes.ROI_SIZE, 
                        error: 'ROISize < 0'
                    }
                )
            }
            return new Promise(resolve => resolve(
                commandService.getPixelCounterIntensityRange(payload.id)
            ))
        })
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
                    data: response
                }
            )
            return new Promise(resolve => resolve(commandService.getPixelCounterNoPixelsInRange(payload.id)))
        })
        .then((response) => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: response
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.ROI_SIZE, 
                    data: getState().commands[commonCommandsTypes.ROI_SIZE].data,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
                    data: getState().commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].data,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: getState().commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
                    error: error || error.message
                }
            )
        })
    }),
    setPixelCounterForm: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
            }
        )

        commandService.setPixelCounterIntensityRange({
            id: payload.id, 
            min: payload.values[0], 
            max: payload.values[1]
        })
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
                    data: [payload.values[0], payload.values[1]]
                }
            )
            return new Promise(resolve => resolve(commandService.setPixelCounterNoPixelsInRange({
                id: payload.id, 
                min: payload.values[2], 
                max: payload.values[3]
            })))
        })
        .then(() => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: [payload.values[2], payload.values[3]]
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE, 
                    data: getState().commands[commonCommandsTypes.PIXEL_COUNTER_INTENSITY_RANGE].data,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: getState().commands[commonCommandsTypes.PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
                    error: error || error.message
                }
            )
        })
    }),
    getEdgePixelCounterForm: thunk(async (actions, payload, {getState}) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.ROI_SIZE, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
            }
        )

        commandService.getROISize(payload.id)
        .then(response => {
            if (response[0] > 0){
                actions.commandIsLoadingSuccess(
                    {
                        actionType: commonCommandsTypes.ROI_SIZE, 
                        data: response[0]
                    }
                )
            } else {
                actions.commandIsLoadingFail(
                    {
                        actionType: commonCommandsTypes.ROI_SIZE, 
                        error: 'ROISize < 0'
                    }
                )
            }
            return new Promise(resolve => resolve(commandService.getEdgePixelCounterStrength(payload.id)))
        })
        .then((response) => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
                    data: response[0]
                }
            )
            return new Promise(resolve => resolve(commandService.getEdgePixelCounterNoPixelsInRange(payload.id)))
        })
        .then((response) => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: response
                }
            )
        })
        .catch(error => {
            console.error(error)
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.ROI_SIZE,
                    data: getState().commands[commonCommandsTypes.ROI_SIZE].data,
                    error: error || error.message 
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
                    data: getState().commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].data,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE,
                    data: getState().commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
                    error: error || error.message 
                }
            )
        })
    }),
    setEdgePixelCounterForm: thunk(async (actions, payload, {getState}) => {
        console.log(payload)
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
            }
        )
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
            }
        )

        commandService.setEdgePixelCounterStrength({id: payload.id, value: payload.values[0]})
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
                    data: payload.values[0]
                }
            )
            return new Promise(resolve => resolve(
                commandService.setEdgePixelCounterNoPixelsInRange({id: payload.id, min: payload.values[1], max: payload.values[2]})
            ))
        })
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE, 
                    data: [payload.values[1], payload.values[2]]
                }
            )
        })
        .catch(error => {
            console.error(error)
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH, 
                    data: getState().commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_STRENGTH].data,
                    error: error || error.message
                }
            )
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE,
                    data: getState().commands[commonCommandsTypes.EDGE_PIXEL_COUNTER_NO_PIXELS_IN_RANGE].data,
                    error: error || error.message 
                }
            )
        })
    }),
    setPatternScoreThreshold:  thunk(async (actions, payload) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
            }
        )

        commandService.setPatternScoreThreshold(payload)
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
                    data: payload.value
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingFail(
                {
                    actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
                    error: error || error.message
                }
            )
        })
    }),
    getPatternScoreThreshold: thunk(async (actions, payload) => {
        actions.commandIsLoadingStart(
            {
                actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
            }
        )

        commandService.getPatternScoreThreshold(payload.id)
        .then(response => {
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
                    data: response[0]
                }
            )
        })
        .catch(error => {
            console.debug(error)
            actions.commandIsLoadingSuccess(
                {
                    actionType: commonCommandsTypes.PATTERN_SCORE_THRESHOLD, 
                    error: error || error.message
                }
            )
        })
    }),
}

export default commonCommandsModel