import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import MockAdapter from "axios-mock-adapter";
import { flatten } from 'flat';
import * as rax from 'retry-axios';
import {parseResponseCommand} from '../utils/http-utils'

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
    backoffType: any,
    onRetryAttempt: (err: AxiosError<any>) => void,
    shouldRetry: (err: AxiosError<any>) => boolean;
}

type backoffType = "static" | "linear" | "exponential"

const raxConfig = {
      retry: 3,
      noResponseRetries: 3,
      retryDelay: 1000,
      httpMethodsToRetry: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
      statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
      backoffType: 'static' as backoffType,
      onRetryAttempt: (err: AxiosError<any>) => {
          console.error(rax.getConfig(err));
        const cfg = rax.getConfig(err);
        console.info(`[http.ts] Retry attempt [${cfg.currentRetryAttempt}]. Cause: ${err}`);
      },
      shouldRetry: (err: AxiosError<any>) => {
          const cfg = rax.getConfig(err);
          if (cfg.currentRetryAttempt >= cfg.retry)
            return false // ensure max retries is always respected
        return rax.shouldRetryRequest(err) //Handle the request based on your other config options, e.g. `statusCodesToRetry` 
      }
}

export interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
    parseJson?: 'statistic' | 'tools' | null,
    parseCmd?: boolean | null,
    iAmRetry?: boolean,
}

const axiosDefaultCustomRequestOptions: ICustomAxiosRequestConfig = {
    parseJson: null,
    parseCmd: null,
    iAmRetry: true
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

    protected _raxId: number;

    public constructor(ip: string) {
        this._baseIP = ip;
        this._baseURL = `http://${ip}`;
        this._instance = axios.create({
            baseURL: this._baseURL
        });

        // this._mockAxios();

        this._initializeResponseInterceptor();
    }

    private _mockAxios() {
        const mock = new MockAdapter(this._instance);
        mock.onGet("gINT_173_0").timeoutOnce();
        mock.onGet("gINT_173_0").reply(200, 1000);

        const images = [
            'https://look.com.ua/pic/201311/640x480/look.com.ua-84440.jpg',
            'https://www.ffonseca.com/imgs/produtos/043010_1_7115_Video_Inspector-sensor_Sick_443x281px.jpg'
        ]

        mock
        .onGet(/LiveImage.jpg\/?.*/)
        .reply(
            200,
            images[Math.floor(Math.random() * images.length)]
        );
        
        mock
            .onGet(/ImageResult\/?.*/).reply(200, { MESSAGE: { MESSAGE_SIZE: 1231, IMAGE_DECISION: 1 } });
        
        mock
            .onGet(/LogImage.jpg\/?.*/).timeoutOnce()

        mock
            .onGet(/LogImage.jpg\/?.*/)
            .reply(
                200,
                'https://www.ffonseca.com/imgs/produtos/043010_1_7115_Video_Inspector-sensor_Sick_443x281px.jpg'
            );
        
        mock.onPost('/LockLog').reply(200, 1);
        mock.onPost('/LockLog?Unlock').reply(200, 1);
    }
    
    private _initializeResponseInterceptor() {

        this._instance.defaults.raxConfig = {
            instance: this._instance
        };

        this._raxId = rax.attach(this._instance);

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
            switch (response.config.responseType) {
                case 'json': 
                    // JSON only for statistic and tools
                    if (response.config.parseJson) {
                        if (response.config.parseJson === 'statistic') {
                            resp.data = flatten(response.data);
                        } else if (response.config.parseJson === 'tools') {
                            // TODO parse tools with prefix
                            // resp.data = ['PIXEL_342141', 'PIXEL_414214', 'EDGE_2131']
                        }
                    }
                    break;
                case 'text': 
                    // Parse command string
                    if (response.config.parseCmd) 
                        resp.data = parseResponseCommand(resp.data); // string[] with data
                    break;
                case 'blob':
                    try {
                        const url = response.data;
                        const blobData = URL.createObjectURL(url);
                        URL.revokeObjectURL(url);
                        resp.data = blobData;
                    } catch (error) {
                        console.error('[http.ts][error] Create blob: ', error)
                        return Promise.reject(resp)
                    }
                    break;
                default: return Promise.resolve(resp);
            }
        return Promise.resolve(resp);
    }

    protected request<T, R = ICustomAxiosResponse<T>>(config: ICustomAxiosRequestConfig): Promise<R> {
        if (!config.iAmRetry) {
            rax.detach( this._raxId, this._instance);
        } else {
            this._raxId = rax.attach(this._instance);
        }
        
        return this._instance.request({
            ...axiosDefaultCustomRequestOptions,
            ...config, 
            raxConfig,
        });
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