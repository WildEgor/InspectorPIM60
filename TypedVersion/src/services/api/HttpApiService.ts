import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';

interface HttpApiService {
    private _baseURL: string
}

class HttpApiService implements IHttpApiService {
    private static _instance: HttpApiService = new HttpApiService('http://192.168.99.9');

    private static _axiosInstance?: AxiosInstance | undefined; 
    private _baseURL: string;

    private constructor() {
        if(HttpApiService._instance){
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        HttpApiService._instance = this;
    }

    public static getInstance(baseURL: string): HttpApiService
    {
        this.baseURL = baseURL
        return HttpApiService._instance;
    }
}

export default HttpApiService;