import React, { useState } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import StyledButton from "../../atoms/StyledButton";
import { Typography } from '@material-ui/core';
import PaperContainer from '../../molecules/PaperContainer';

import LoaderContainer from "../../molecules/LoaderContainer";

interface Props {
  width?: number,
  height?: number,
  range: Array<number>,
  getImage: (id: number) => Promise<string>
  isError?: (error: string) => void,
  lockLogger: (lock?: boolean) => Promise<boolean>
}

interface CarouselImage {
  src: string, // required
  srcset?: string, // `https://placedog.net/400/240?id=1 400w, https://placedog.net/700/420?id=1 700w, https://placedog.net/1000/600?id=1 1000w`,
  sizes?: string, // '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
  alt?: string,
  thumbnail?: string 
}

const LogImageList = (props: Props) => {
  const { getImage, lockLogger, isError, range, width = 640, height = 480 } = props;

  const [logImages, setLogImages] = useState<CarouselImage[]>([{ src: '' }]);
  const [needUpdateLogger, setNeedUpdateLogger] = useState<boolean>(false);
  const [errorWhenUpdate, setErrorWhenUpdate] = useState<boolean>(true);

  const errorHandler = (message: string) => {
    if (isError) {
      isError(message);
      throw new Error(message)
    } else {
      console.error(message);
    }
  }

  const getImages = async () => {
      if (range.length && range[0] < range[1]){
        const isLock = await lockLogger(true)
  
        if (isLock) {
          const logImages = await Promise.all<string>(Array.from({ length: range[1] - (range[0] + 1) }, (_v , k)=> {
            return getImage(k + range[0]);
          }))
    
          const isUnlock = await lockLogger(false)
  
          if (!isUnlock) {
            setErrorWhenUpdate(true);
            errorHandler('Error when update unlock logger');
          }
    
          if(logImages) {
            const images: CarouselImage[] = logImages.map((item: string) => {
              return {
                src: item,
                thumbnail: item,
                sizes: `(max-width: 640px) ${width}px`
              }
            })
            
            setLogImages(images);
          } else {
            setErrorWhenUpdate(true);
            errorHandler('Error when empty log images');
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
  }

  return(
    <PaperContainer width={640}>
      {errorWhenUpdate && <Typography variant='h5'>Logger</Typography>}
      <LoaderContainer updateData={getImages} needUpdate={needUpdateLogger} isError={setErrorWhenUpdate}>
        <Carousel images={logImages} style={{ height: height - 10, width: width - 10 }} />
        <StyledButton 
          size='small'
          value={0} 
          onClick={() => {
              setNeedUpdateLogger(!needUpdateLogger)
              // getImages()
            }
          } 
          color='primary' 
          variant="outlined"
        >
          <Typography>UPDATE LOGS</Typography>
        </StyledButton>
      </LoaderContainer>
    </PaperContainer>
  )
}

export default LogImageList;