import axios from 'axios';
import * as rax from 'retry-axios';
import delayAdapterEnhancer from 'axios-delay';
import { parseResponseCommand } from './data-utils';
import config from '../config';
//import MockAdapter from "axios-mock-adapter";

const baseURL = new URL(config.BASE_URL);

/**
* Create an Axios Client with defaults
*/
const client = axios.create({ 
    baseURL: baseURL.origin, 
    adapter: delayAdapterEnhancer(axios.defaults.adapter),
    // headers: {
    //     'Access-Control-Allow-Origin': '*',
    // },
    //withCredentials: true, // default
});

client.defaults.raxConfig = { instance: client };

// const customAxios = (dynamicBaseURL) => {
//     // axios instance for making requests
//     const axiosInstance = axios.create({
//       baseURL: dynamicBaseURL
//     });
  
//     return axiosInstance;
// };

// const mock = new MockAdapter(client);

// mock.onGet('/LockLog').reply(200, '')
// mock.onGet('/LockLog?Unlock').reply(200, '')
// mock.onGet(/LiveImage.jpg\/?.*/).reply(200, 'https://www.befunky.com/images/prismic/b60244c7-087b-409a-961b-831999aa5085_llama.jpg')
// mock.onGet(/ImageResult\/?.*/).reply(200, {'MESSAGE': {'MESSAGE_SIZE': 1231, IMAGE_DECISION: 1}})
// mock.onGet(/LogImage.jpg\/?.*/).reply(200, 'https://www.befunky.com/images/prismic/b60244c7-087b-409a-961b-831999aa5085_llama.jpg')

// mock.onGet('/CmdChannel?gMOD').reply(200, 'rgMOD 0 0 0')
// mock.onGet('/CmdChannel?sMOD_1').reply(200, 'rsMOD 0 0')
// mock.onGet('/CmdChannel?sMOD_0').reply(200, 'rsMOD 0 0')
// mock.onGet('/CmdChannel?aACT_1').reply(200, 'raACT 1 0 0')
// mock.onGet('/CmdChannel?gSTR_14_2_0').reply(200, 'rgSTR 14 0 pixel_counter-1')
// mock.onGet(/CmdChannel?sINT_1_*/).reply(200, 'rsINT 2 0')
// mock.onGet('/CmdChannel?gINT_1').reply(200, 'rgINT 1 0 2 0')
// mock.onGet('/CmdChannel?gINT_2').reply(200, 'rgINT 2 0 3 0')
// mock.onGet(/getRefObject\/?.*/).reply(200, 'https://www.befunky.com/images/prismic/b60244c7-087b-409a-961b-831999aa5085_llama.jpg')
// mock.onGet(/ActiveReferenceImage.jpg\/?.*/).reply(200, 'https://www.befunky.com/images/prismic/b60244c7-087b-409a-961b-831999aa5085_llama.jpg')

const interceptorId = rax.attach(client);
  
/*
* Request Wrapper with default success/error actions
*/
const request = function(options) {
    const onSuccess = function(response) {
        console.debug('Request Successful!', response);
        if (response.config.parse === true) {
        switch (response.config.responseType) {
            case 'json': return Promise.resolve(response.data)
            case 'text': 
                const parsedResponse = parseResponseCommand(response.data)
                console.log('PARSED DATA ->>>>', parsedResponse)
                if (parsedResponse.errorCode == 0) {
                    response.data = parsedResponse
                    return Promise.resolve(response.data.values || response.data.mode)
                }
                console.log('ERROR HTTP-UTILS', parsedResponse.errorCode)
                return Promise.reject(new Error(parsedResponse.errorCode));
            case 'blob':
                if (response.data){
                    try {
                        console.log('RESPONSE.DATA', response)
                        const blobData = URL.createObjectURL(response.data)
                        // const blobData = response.data
                        return Promise.resolve(blobData)
                    } catch (error) {
                        console.log('ERROR HTTP-UTILS', error)
                        return Promise.reject(error)
                    } 
                }
            default: return Promise.resolve(response.data)
        }
    } else { 
        return Promise.resolve(response)
    }
    }

    const onError = function(error) {
            console.error('Request Failed:', error.config);
        if (error.response) {
            console.error('Status:',  error.response.status);
            console.error('Data:',    error.response.data);
            console.error('Headers:', error.response.headers);
            return Promise.reject(error.response.status);
        } else {
            console.error('Error Message:', error.message);
            return Promise.reject(error.message);
        }
    }

return client({
    ...options, 
    // validateStatus: function (status) {
    //     return status < 500;}
    })
    .then(onSuccess)
    .catch(onError);
}

const fetchCsv = (options) => {
    return request({
        method: 'GET',
        responseType: 'text',
        timeout: options.timeout || 3000,
        ...options,
        // raxConfig: {
        //     ...options.raxConfig,
        //     instance: client,
        // }
    })
}

const fetchJson = (options) => {
    return request({
        method: 'GET',
        responseType: 'json',
        timeout: options.timeout || 3000,
        ...options,
        // raxConfig: {
        //     ...options.raxConfig,
        //     instance: client,
        // }
    })
}

const fetchBlob = (options) => {
    return request({
        method: 'GET',
        responseType: 'blob',
        timeout: options.timeout || 150,
        ...options,
        // raxConfig: {
        //     ...options.raxConfig,
        //     instance: client,
        // }
    })
}

/*
    options => {url, delay, timeout, params}
*/
export {
    fetchCsv,
    fetchJson,
    fetchBlob
};