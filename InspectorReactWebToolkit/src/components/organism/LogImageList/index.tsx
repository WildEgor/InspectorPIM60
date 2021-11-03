import React, { useEffect, useState } from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import { Typography } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import StyledButton from "Src/components/atoms/StyledButton";
import PaperContainer from 'Src/components/molecules/PaperContainer';

import "react-image-gallery/styles/css/image-gallery.css"

interface Props {
  width?: number,
  height?: number,
  range: Array<number>,
  getImage: (id: number) => Promise<string>
  isError?: (error: string) => void,
  lockLogger: (lock?: boolean) => Promise<boolean>
}

interface CarouselImage {
  original: string,
  thumbnail: string,
  originalHeight?: number,
  originalWidth?: number,
}

const LogImageList = (props: Props) => {
  const { getImage, lockLogger, isError, range, width = 640, height = 480 } = props;

  const [logImages, setLogImages] = useState<CarouselImage[]>([{ original: 'null', thumbnail: 'null' }]);
  const [needUpdateLogger, setNeedUpdateLogger] = useState<boolean>(false);
  const [errorWhenUpdate, setErrorWhenUpdate] = useState<boolean>(false);

  useEffect(() => {
    getImages();
  }, [])

  const errorHandler = (message: string) => {
    isError && isError(message);
    console.error(message);
  }

  async function doAllSequentually(fnPromiseArr: any) {
    for (let i=0; i < fnPromiseArr.length; i++) {
      const image = await fnPromiseArr[i];
      setLogImages( oldArray => [...oldArray, {
        original: image,
        thumbnail: image,
        originalHeight: height,
        originalWidth: width,
      }]);
    }
  }

  const getImages = async () => {
    try {
      if (range.length && range[0] < range[1]){
        const isLock = await lockLogger(true)
  
        if (isLock) {
  
          setLogImages([]); 
          
          const promisifiedImages = (Array.from({ length: (range[1] - range[0])}, (_v , k)=> getImage(k + range[0])));
          await doAllSequentually(promisifiedImages);
          
          const isUnlock = await lockLogger(false)
  
          if (!isUnlock) {
            setErrorWhenUpdate(true);
            errorHandler('Error when update unlock logger');
          }
        } else {
          await lockLogger(false)
          setErrorWhenUpdate(true);
          errorHandler('Error when update lock logger');
        }
      } else {
        setErrorWhenUpdate(true);
        errorHandler('System error!'); 
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return(
    <PaperContainer width={640}>
      {errorWhenUpdate && <Typography variant='h5'>Logger</Typography>}
        <ImageGallery 
          lazyLoad
          showIndex
          items={logImages} 
        />
        <StyledButton 
          size='small'
          value={0} 
          onClick={() => {
              setNeedUpdateLogger(!needUpdateLogger)
              getImages()
            }
          } 
          startIcon={<UpdateIcon/>}
          color='primary' 
          variant="contained"
        >
          <Typography>UPDATE LOG IMAGES</Typography>
        </StyledButton>
    </PaperContainer>
  )
}

export default LogImageList;