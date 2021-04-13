// services/api/*
import * as rax from 'retry-axios';
import axios from 'axios';
import { fetchCsv, fetchBlob, fetchJson } from 'Utils/http-utils'

const hardRetry = {
  raxConfig: {
    retry: 3,
    noResponseRetries: 5,
    retryDelay: 3000,
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
    statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
    backoffType: 'exponential',
    onRetryAttempt: err => {
      const cfg = rax.getConfig(err);
      console.log(`Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
    },
    shouldRetry: err => {
        const cfg = rax.getConfig(err);
        if (cfg.currentRetryAttempt >= cfg.retry) return false // ensure max retries is always respected
    
        // if (err.response.statusText.includes('Try again')) //Always retry this status text, regardless of code or request type
        // return true
  
        return rax.shouldRetryRequest(err) //Handle the request based on your other config options, e.g. `statusCodesToRetry`
    }
  }
}

function getInt (...args){
  const normalArray = args;

  if (!normalArray.length)
    return `/CmdChannel?gINT_${arguments[0]}`
  
  const params = normalArray.join('_')
  console.log('PARAMS', params)
  return `/CmdChannel?gINT_${params}`
}

function setInt (...args){
  const normalArray = args;
  console.log('normalArray', normalArray)
  console.log('normalArray', normalArray.join('_'))
  if (!normalArray.length)
    return `/CmdChannel?sINT_${arguments[0]}`

  const params = normalArray.join('_')
  console.log('PARAMS', params)
  return `/CmdChannel?sINT_${params}`
}

// **************** LogLogs ****************
const lockLogImages = () => {
  return fetchCsv({ 
    url: `/LockLog`, 
    parse: false, 
    delay: 3000, 
    timeout: 65000, 
    params: {},
    ...hardRetry
  });
}

const unlockLogImages = () => {
  return fetchCsv({ 
    url: `/LockLog?Unlock`, 
    parse: false, 
    delay: 3000, 
    timeout: 65000, 
    params: {},
    ...hardRetry
  });
}

const loadLogImage = ({id, cmd}) => {
  return fetchBlob({ 
    url: `/LogImage.jpg?${id}${cmd? `&${cmd}` : ''}`,
    parse: true, 
    delay: 500, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

// **************** LiveImages ****************
const getLiveImage = ({cmd, id, s}) => {
  const source = axios.CancelToken.source();

  return fetchBlob({ 
    url: `/LiveImage.jpg${cmd? `?${cmd}` : ''}`, 
    parse: true, 
    delay: 150, 
    timeout: 30000, 
    params: { id, s },
    cancelToken: source.token,
    raxConfig: {
      ...hardRetry.raxConfig,
      onRetryAttempt: err => {
        const cfg = rax.getConfig(err);
        startStopLive(true)
        console.log(`Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
      },
      shouldRetry: err => {
        const cfg = rax.getConfig(err);
        if (cfg.currentRetryAttempt >= cfg.retry) {
          source.cancel("CANCEL LIVE IMAGE");
          return false
        } // ensure max retries is always respected
      }
    }
  });
}

const getLiveStatistic = ({id, s}) => {
  return fetchJson({ 
    url: '/ImageResult', 
    parse: true, 
    delay: 150, 
    timeout: 105000, 
    params: { id, s },
    raxConfig: {
      ...hardRetry.raxConfig,
      shouldRetry: err => {
        const cfg = rax.getConfig(err);
        if (cfg.currentRetryAttempt >= cfg.retry) {
          //source.cancel("CANCEL LIVE IMAGE");
          return false
        } 
      }
    }
  });
}

// **************** CommonCommands ****************
const saveToFlash = () => {
  return fetchCsv({ 
    url: `/CmdChannel?aACT_1`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const setCamMode = (mode) => {
  return fetchCsv({ 
    url: `/CmdChannel?sMOD_${mode}`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry.raxConfig,
    shouldRetry: err => {
      return true 
    }
  });
}

const getCamMode = () => {
  return fetchCsv({ 
    url: `/CmdChannel?gMOD`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry.raxConfig,
    shouldRetry: err => true 
  });
}

const getCamStatus = () => {
  return fetchCsv({ 
    url: `/LiveImageStatus`, 
    parse: false, 
    delay: 3000, 
    params: {},
    ...hardRetry
  });
}

const getAvailableTools = (id) => {
  return fetchCsv({ 
    url: `/CmdChannel?gSTR_14_${id}_0`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const getROISize = (id) => {
  return fetchCsv({ 
    url: getInt(87, id), 
    parse: true, 
    delay: 3000,  
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setObjLocMatchThreshold = (id) => {
  return fetchCsv({ 
    url: setInt(32, id), 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getObjLocMatchThreshold = () => {
  return fetchCsv({ 
    url: getInt(32), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPixelCounterIntensityRange = ({id, min, max}) => {
  return fetchCsv({ 
    url: setInt(80, id, min, max), 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPixelCounterIntensityRange = (id) => {
  return fetchCsv({ 
    url: getInt(80, id), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPixelCounterNoPixelsInRange = ({id, max, min}) => {
  return fetchCsv({ 
    url: setInt(81, id, min, max), 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPixelCounterNoPixelsInRange = (id) => {
  return fetchCsv({ 
    url: getInt(81, id), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setEdgePixelCounterStrength = ({id, value}) => {
  return fetchCsv({ 
    url: setInt(82, id, value), 
    parse: true, 
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getEdgePixelCounterStrength = (id) => {
  return fetchCsv({ 
    url:  getInt(82, id), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setEdgePixelCounterNoPixelsInRange = ({id, min, max}) => {
  return fetchCsv({ 
    url:  setInt(83, id, min, max), 
    parse: true, 
    delay: 3000,
    timeout: 65000, 
    params: {},
    ...hardRetry
  });
}

const getEdgePixelCounterNoPixelsInRange = (id) => {
  return fetchCsv({ 
    url: getInt(83, id), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPatternScoreThreshold = ({id, value}) => {
  return fetchCsv({ 
    url: setInt(85, id, value), 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPatternScoreThreshold = (id) => {
  return fetchCsv({ 
    url: getInt(85, id), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

// **************** ReferenceCommands ****************
const getActiveReferenceObject = () => {
  return fetchBlob({ 
    url: `/ActiveReferenceImage.jpg`, 
    parse: true, 
    delay: 1000, 
    timeout: 3000,
    params: {},
    ...hardRetry
  });
}

const getReferenceObject = (id) => {
  return fetchBlob({ 
    url: `/getRefObject?${id}`, // 0 - start 
    parse: true, 
    delay: 1000, 
    timeout: 3000,
    params: {},
    ...hardRetry
  });
}

const setReferenceObject = (id) => {
  return fetchCsv({ 
    url: setInt(1, id), // 0 - start 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getNumberActiveReferenceObject = () => {
  return fetchCsv({ 
    url: getInt(1), 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const getCountActiveReferenceObject = () => {
  return fetchCsv({ 
    url: getInt(2), 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const CommandService = {
  getLiveImage,
  getLiveStatistic,
  setCamMode,
  getCamMode,
  saveToFlash,
  getActiveReferenceObject,
  getReferenceObject,
  setReferenceObject,
  getNumberActiveReferenceObject,
  getCountActiveReferenceObject,
  getAvailableTools,
  getROISize,
  setObjLocMatchThreshold,
  getObjLocMatchThreshold,
  setPixelCounterIntensityRange,
  getPixelCounterIntensityRange,
  setPixelCounterNoPixelsInRange,
  getPixelCounterNoPixelsInRange,
  setEdgePixelCounterStrength,
  getEdgePixelCounterStrength,
  setEdgePixelCounterNoPixelsInRange,
  getEdgePixelCounterNoPixelsInRange,
  setPatternScoreThreshold,
  getPatternScoreThreshold,
  lockLogImages,
  unlockLogImages,
  loadLogImage
}

export default CommandService;