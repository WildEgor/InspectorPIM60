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
    timeout: 1000, 
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

const setCamMode = (payload) => {
  return fetchCsv({ 
    url: `/CmdChannel?sMOD_${payload.mode}`, 
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
    url: `/CmdChannel?gINT_87_${id}`, 
    parse: true, 
    delay: 3000,  
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setObjLocMatchThreshold = (id) => {
  return fetchCsv({ 
    url: `/CmdChannel?sINT_32_${id}`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getObjLocMatchThreshold = () => {
  return fetchCsv({ 
    url: `/CmdChannel?gINT_32`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPixelCounterIntensityRange = ({id, min, max}) => {
  return fetchCsv({ 
    url: `/CmdChannel?sINT_80_${id}_${min}_${max}`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPixelCounterIntensityRange = (id) => {
  return fetchCsv({ 
    url: `/CmdChannel?gINT_80_${id}`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPixelCounterNoPixelsInRange = ({id, max, min}) => {
  return fetchCsv({ 
    url: `/CmdChannel?sINT_81_${id}_${min}_${max}`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPixelCounterNoPixelsInRange = (id) => {
  return fetchCsv({ 
    url: `/CmdChannel?gINT_81_${id}`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setEdgePixelCounterStrength = ({id, value}) => {
  return fetchCsv({ 
    url: `/CmdChannel?sINT_82_${id}_${value}`, 
    parse: true, 
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getEdgePixelCounterStrength = (id) => {
  return fetchCsv({ 
    url:  `/CmdChannel?gINT_82_${id}`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setEdgePixelCounterNoPixelsInRange = ({id, min, max}) => {
  return fetchCsv({ 
    url:  `/CmdChannel?sINT_83_${id}_${min}_${max}`, 
    parse: true, 
    delay: 3000,
    timeout: 65000, 
    params: {},
    ...hardRetry
  });
}

const getEdgePixelCounterNoPixelsInRange = (id) => {
  return fetchCsv({ 
    url:   `/CmdChannel?gINT_83_${id}`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const setPatternScoreThreshold = ({id, value}) => {
  return fetchCsv({ 
    url:   `/CmdChannel?sINT_85_${id}_${value}`, 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getPatternScoreThreshold = (id) => {
  return fetchCsv({ 
    url:   `/CmdChannel?gINT_85_${id}`, 
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

const getReferenceObject = (payload) => {
  return fetchBlob({ 
    url: `/getRefObject?${payload.id}`, // 0 - start 
    parse: true, 
    delay: 1000, 
    timeout: 3000,
    params: {},
    ...hardRetry
  });
}

const setReferenceObject = (payload) => {
  return fetchCsv({ 
    url: `/CmdChannel?sINT_1_${payload.id}`, // 0 - start 
    parse: true, 
    delay: 3000, 
    timeout: 65000,
    params: {},
    ...hardRetry
  });
}

const getNumberActiveReferenceObject = () => {
  return fetchCsv({ 
    url: `/CmdChannel?gINT_1`, 
    parse: true, 
    delay: 3000, 
    timeout: 30000,
    params: {},
    ...hardRetry
  });
}

const getCountActiveReferenceObject = () => {
  return fetchCsv({ 
    url: `/CmdChannel?gINT_2`, 
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

/**
 * CommandService
      .getCamMode()
      .then((response) => {
        console.log('Parsed response', response)
      });
 */