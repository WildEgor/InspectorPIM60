import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import MockAdapter from "axios-mock-adapter";
import * as rax from 'retry-axios';
import {parseResponseCommand} from '../../utils/http-utils'

enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}

export interface RaxConfig {
    retry: number,
    noResponseRetries: number,
    retryDelay: number,
    httpMethodsToRetry: string[],
    statusCodesToRetry: number[][],
    backoffType: 'exponential' | 'linear' | 'static',
    onRetryAttempt: (err: AxiosError<any>) => void,
    shouldRetry: (err: AxiosError<any>) => boolean;
}

const raxConfig = {
      retry: 3,
      noResponseRetries: 5,
      retryDelay: 3000,
      httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
      statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
      backoffType: 'exponential',
      onRetryAttempt: (err: AxiosError<any>) => {
        const cfg = rax.getConfig(err);
        console.log(`[http.ts] Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
      },
      shouldRetry: (err: AxiosError<any>) => {
          const cfg = rax.getConfig(err);
          if (cfg.currentRetryAttempt >= cfg.retry)
            return false // ensure max retries is always respected
        return rax.shouldRetryRequest(err) //Handle the request based on your other config options, e.g. `statusCodesToRetry` 
      }
}

export interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
    parse?: boolean,
    raxConfig?: RaxConfig 
}

export interface ICustomAxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: ICustomAxiosRequestConfig;
}

abstract class HttpClient {
    private _instance: AxiosInstance;
    protected _baseURL: string;
    protected _baseIP: string;

    public constructor(ip: string) {
        this._baseIP = ip;
        this._baseURL = `http://${ip}`;
        this._instance = axios.create({
            baseURL: this._baseURL,
        });

        // const mock = new MockAdapter(this._instance);

        // mock
        //     .onGet(/LiveImage.jpg\/?.*/)
        //     .reply(
        //         200,
        //         'https://www.ffonseca.com/imgs/produtos/043010_1_7115_Video_Inspector-sensor_Sick_443x281px.jpg'
        //     );
        
        // mock
        //     .onGet(/ImageResult\/?.*/).reply(200, { MESSAGE: { MESSAGE_SIZE: 1231, IMAGE_DECISION: 1 } });
        
        // mock
        //     .onGet(/LogImage.jpg\/?.*/)
        //     .reply(
        //         200,
        //         'https://www.ffonseca.com/imgs/produtos/043010_1_7115_Video_Inspector-sensor_Sick_443x281px.jpg'
        //     );
        
        // mock.onPost('/LockLog').reply(200, 1);
        // mock.onPost('/LockLog?Unlock').reply(200, 1);

        this._initializeResponseInterceptor();
    }
    
    private _initializeResponseInterceptor() {
        this._instance.interceptors.request.use(
            this._handleRequest,
            error => {
                const { response } = error;
                return this._handleError(response)
            } 
        );
    
        this._instance.interceptors.response.use(
          this._handleResponse,
          this._handleError
        );
    }

    protected _handleRequest (config: ICustomAxiosRequestConfig): ICustomAxiosRequestConfig {
        return config;
    }

    private _handleError(error: Error | AxiosError) {

        if (axios.isAxiosError(error))  {
            const { code } = error;
            switch (Number(code)) {
                case StatusCode.InternalServerError: {
                  // Handle InternalServerError
                  break;
                }
                case StatusCode.Forbidden: {
                  // Handle Forbidden
                  break;
                }
                case StatusCode.Unauthorized: {
                  // Handle Unauthorized
                  break;
                }
                case StatusCode.TooManyRequests: {
                  // Handle TooManyRequests
                  break;
                }
              }
            // Access to config, request, and response
          } else {
              
            // Just a stock error
          }
    
        return Promise.reject(error);
    }

    protected _handleResponse = (response: ICustomAxiosResponse): Promise<ICustomAxiosResponse> => {
        const resp = response;
        if (response.config.parse){
            switch (response.config.responseType) {
                case 'json': 
                    // return Promise.resolve(resp.data);
                    break;
                case 'text': 
                    const data = resp.data.toString();
                    const parsedResponse = parseResponseCommand(data);
                    resp.data = 0;
                    if (parsedResponse.errorCode == 0) 
                        resp.data = parsedResponse;
                    break;
                case 'blob':
                    try {
                        console.log('[http.ts] Create blob response: ', response)
                        // const blobData = URL.createObjectURL(response.data);
                        // resp.data = blobData;
                        // console.log('Created blob: ', blobData);
                    } catch (error) {
                        console.error('[http.ts][error] Create blob: ', error)
                    }
                    break;
                default: return Promise.resolve(resp.data);
            }
        }
        return Promise.resolve(resp.data);
    }

    protected request<T, R = ICustomAxiosResponse<T>>(config: ICustomAxiosRequestConfig): Promise<R> {
        const conf = {...config, ...raxConfig};
        return this._instance.request(conf);
    }

    protected get<T, R = ICustomAxiosResponse<T>>(url: string, config?: ICustomAxiosResponse): Promise<R> {
        return this._instance.get<T, R>(url, config);
    }
    
    protected post<T, R = ICustomAxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this._instance.post<T, R>(url, data, config);
    }
}

export default HttpClient