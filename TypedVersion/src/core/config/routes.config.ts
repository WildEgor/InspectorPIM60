// import { serverURI } from './api.config';

const liveImageAPIRoutes = {
    getLiveImage: (type?: string) => `/LiveImage.jpg${type? `?${type}` : ''}`, 
    getLiveImageStatistic: () => '/ImageResult',

};

const logImageAPIRoutes = {
    setLogImagesState: (lock: boolean) => lock? `/LockLog` : `/LockLog?Unlock`,
    getLogImage: (id: string, type?: string) => `/LogImage.jpg?${id}${type? `&${type}` : ''}`
};

// const settingsImageAPIRoutes = {

// };

export {
    liveImageAPIRoutes,
    logImageAPIRoutes
}