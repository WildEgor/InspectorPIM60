import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import parseResponseCommand from 'Utils/http-utils'

enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}

export interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
    parse?: boolean;
}

export interface ICustomAxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: ICustomAxiosRequestConfig;
}

const injectRequestOption = (config: ICustomAxiosRequestConfig): ICustomAxiosRequestConfig => {
    return config;
};

class HttpApiService {
    private _baseURL: string = process.env.NODE_ENV === 'production'? window.location.href : 'http://192.168.99.9';
    private _instance: AxiosInstance | null = null;

    constructor(baseURL: string){
        this._baseURL = baseURL;
        this.initHttp();
    }

    private get http(): AxiosInstance {
        return this._instance != null ? this._instance : this.initHttp();
    }
    
    initHttp() {
        const http = axios.create({
          baseURL: this._baseURL,
          // headers,
          // withCredentials: true,
        });
    
        http.interceptors.request.use(
            injectRequestOption, 
            (error) => Promise.reject(error)
        );
    
        http.interceptors.response.use(
          (response) => this.handleSuccess(response),
          (error) => {
            const { response } = error;
            return this.handleError(response);
          }
        );
    
        this._instance = http;
        return http;
    }

    private handleError(response: ICustomAxiosResponse){
        const { status } = response;

        switch (status) {
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

        return Promise.reject(response);
    }

    private handleSuccess(response: ICustomAxiosResponse): ICustomAxiosResponse {
        let resp = response;
        if (response.config.parse){
            switch (response.config.responseType) {
                case 'json': return resp.data;
                case 'text': 
                    const data = resp.data.toString();
                    const parsedResponse = parseResponseCommand(data)
                    resp.data = null
                    if (parsedResponse.errorCode == 0) 
                        resp.data = parsedResponse
                    return resp.data 
                case 'blob':
                    try {
                        const blobData = URL.createObjectURL(response.data);
                        resp.data = blobData;
                        return resp.data
                    } catch (error) {
                        console.log('ERROR HTTP-UTILS', error)
                        break;
                    }
                default: resp.data
            }
        }
        return resp
    }

    request<T = any, R = ICustomAxiosResponse<T>>(config: ICustomAxiosRequestConfig): Promise<R> {
        return this.http.request(config);
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.get<T, R>(url, config);
    }
    
    post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config);
    }
}

export const http = new HttpApiService('http://192.168.99.9');