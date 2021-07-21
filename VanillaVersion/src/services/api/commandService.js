/* eslint-disable prefer-rest-params */
// services/api/*
import * as rax from 'retry-axios';
import axios from 'axios';
import { requestApi } from 'Utils/http-utils';

const hardRetry = {
  raxConfig: {
    retry: 3,
    noResponseRetries: 5,
    retryDelay: 3000,
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
    statusCodesToRetry: [
      [100, 199],
      [429, 429],
      [500, 599],
    ],
    backoffType: 'exponential',
    onRetryAttempt: (err) => {
      const cfg = rax.getConfig(err);
      console.log(`Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
    },
    shouldRetry: (err) => {
      const cfg = rax.getConfig(err);
      if (cfg.currentRetryAttempt >= cfg.retry) return false; // ensure max retries is always respected

      // if (err.response.statusText.includes('Try again')) //Always retry this status text, regardless of code or request type
      // return true

      return rax.shouldRetryRequest(err); // Handle the request based on your other config options, e.g. `statusCodesToRetry`
    },
  },
};

function getInt(...args) {
  const normalArray = args;

  if (!normalArray.length) return `/CmdChannel?gINT_${arguments[0]}`;

  const params = normalArray.join('_');
  console.log('PARAMS', params);
  return `/CmdChannel?gINT_${params}`;
}

function setInt(...args) {
  const normalArray = args;
  console.log('normalArray', normalArray);
  console.log('normalArray', normalArray.join('_'));
  if (!normalArray.length) return `/CmdChannel?sINT_${arguments[0]}`;

  const params = normalArray.join('_');
  console.log('PARAMS', params);
  return `/CmdChannel?sINT_${params}`;
}

// **************** LogLogs ****************
const lockLogImages = () =>
  requestApi({
    method: 'GET',
    responseType: 'blob',
    url: `/LockLog`,
    parse: false,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const unlockLogImages = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: `/LockLog?Unlock`,
    parse: false,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const loadLogImage = ({ id, cmd }) =>
  requestApi({
    method: 'GET',
    responseType: 'blob',
    url: `/LogImage.jpg?${id}${cmd ? `&${cmd}` : ''}`,
    parse: true,
    delay: 500,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

// **************** LiveImages ****************
const getLiveImage = ({ cmd, id, s }) => {
  const source = axios.CancelToken.source();

  return requestApi({
    method: 'GET',
    responseType: 'blob',
    url: `/LiveImage.jpg${cmd ? `?${cmd}` : ''}`,
    parse: true,
    delay: 150,
    timeout: 30000,
    params: { id, s },
    cancelToken: source.token,
    raxConfig: {
      ...hardRetry.raxConfig,
      onRetryAttempt: (err) => {
        const cfg = rax.getConfig(err);
        // startStopLive(true);
        console.log(`Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
      },
      shouldRetry: (err) => {
        const cfg = rax.getConfig(err);
        if (cfg.currentRetryAttempt >= cfg.retry) {
          source.cancel('CANCEL LIVE IMAGE');
          return false;
        } // ensure max retries is always respected
      },
    },
  });
};

const getLiveStatistic = ({ id, s }) =>
  requestApi({
    method: 'GET',
    responseType: 'json',
    url: '/ImageResult',
    parse: true,
    delay: 150,
    timeout: 105000,
    params: { id, s },
    raxConfig: {
      ...hardRetry.raxConfig,
      shouldRetry: (err) => {
        const cfg = rax.getConfig(err);
        if (cfg.currentRetryAttempt >= cfg.retry) {
          // source.cancel("CANCEL LIVE IMAGE");
          return false;
        }
      },
    },
  });

// **************** CommonCommands ****************
const saveToFlash = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: `/CmdChannel?aACT_1`,
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const setCamMode = (mode) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: `/CmdChannel?sMOD_${mode}`,
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry.raxConfig,
    shouldRetry: () => true,
  });

const getCamMode = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: `/CmdChannel?gMOD`,
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry.raxConfig,
    shouldRetry: () => true,
  });

// const getCamStatus = () =>
//   requestApi({
//     method: 'GET',
//     responseType: 'text',
//     url: `/LiveImageStatus`,
//     parse: false,
//     delay: 3000,
//     params: {},
//     ...hardRetry,
//   });

const getAvailableTools = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: `/CmdChannel?gSTR_14_${id}_0`,
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const getROISize = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(87, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setObjLocMatchThreshold = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(32, id),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getObjLocMatchThreshold = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(32),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setPixelCounterIntensityRange = ({ id, min, max }) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(80, id, min, max),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getPixelCounterIntensityRange = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(80, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setPixelCounterNoPixelsInRange = ({ id, max, min }) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(81, id, min, max),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getPixelCounterNoPixelsInRange = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(81, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setEdgePixelCounterStrength = ({ id, value }) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(82, id, value),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getEdgePixelCounterStrength = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(82, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setEdgePixelCounterNoPixelsInRange = ({ id, min, max }) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(83, id, min, max),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getEdgePixelCounterNoPixelsInRange = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(83, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const setPatternScoreThreshold = ({ id, value }) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(85, id, value),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getPatternScoreThreshold = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(85, id),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

// **************** ReferenceCommands ****************
const getActiveReferenceObject = () =>
  requestApi({
    method: 'GET',
    responseType: 'blob',
    url: `/ActiveReferenceImage.jpg`,
    parse: true,
    delay: 1000,
    timeout: 3000,
    params: {},
    ...hardRetry,
  });

const getReferenceObject = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'blob',
    url: `/getRefObject?${id}`, // 0 - start
    parse: true,
    delay: 1000,
    timeout: 3000,
    params: {},
    ...hardRetry,
  });

const setReferenceObject = (id) =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: setInt(1, id), // 0 - start
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

const getNumberActiveReferenceObject = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(1),
    parse: true,
    delay: 3000,
    timeout: 30000,
    params: {},
    ...hardRetry,
  });

const getCountActiveReferenceObject = () =>
  requestApi({
    method: 'GET',
    responseType: 'text',
    url: getInt(2),
    parse: true,
    delay: 3000,
    timeout: 65000,
    params: {},
    ...hardRetry,
  });

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
  loadLogImage,
};

export default CommandService;
