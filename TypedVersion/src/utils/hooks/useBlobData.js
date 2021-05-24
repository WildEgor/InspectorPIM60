import { useState, useEffect } from 'react';
import { fetchBlob } from 'utils/data-utils';

export default function useBlobData(url, params) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchBlob(url, params);
        const blob = URL.createObjectURL(result);
        setData(blob);
      } catch (error) { 
        // throw Error(error)
      }
    };

    loadData();
  }, [url]);

  return {
    data,
    isLoading: !data,
  };
}
