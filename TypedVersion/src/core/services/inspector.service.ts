import { http } from './http';
import { routesConfig } from '../config';

async function getLiveImage (id: number, s: number, type?: string): Promise<Blob> {
    const { data } = await http.Client.request({
        method: 'GET',
        responseType: 'blob',
        url: routesConfig.liveImageAPIRoutes.getLiveImage(type),
        parse: true,
        timeout: 30000,
        params: { id, s },
      });
    
      return data;
}

export default getLiveImage
