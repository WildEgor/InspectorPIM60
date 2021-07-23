import React, { useState } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import { handlePromise } from "../../../core/utils/http-utils";

import StyledButton from "../../atoms/StyledButton";
import { Typography } from '@material-ui/core';
import PaperContainer from '../../PaperContainer';

import LoaderContainer from "../../molecules/LoaderContainer";

interface Props {
  width?: number,
  height?: number,
  range: Array<number>,
  getImage: (id: number) => Promise<any>
  isError: (error: string) => void,
  lockLogger: (lock?: boolean) => Promise<any>
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

  const [logImages, setLogImages] = useState<CarouselImage[]>([{
    src: ''
  }]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getImages = async () => {
    if (range.length && range[0] < range[1]){
      await lockLogger(true)

      const [errorLogImages, logImages] = await handlePromise(Promise.all<string>(Array.from({ length: range[1] - range[0] + 1 }, (_v , k)=> {
        return getImage(k + range[0]);
      })))

      if (errorLogImages) isError('Error when request log images');

      await lockLogger(false)

      console.log('Logger images: ', logImages);

      if(!errorLogImages && logImages.length) {
        const images: CarouselImage[] = logImages.map((item: string) => {
          return {
            src: item,
            thumbnail: item,
            sizes: `(max-width: 640px) ${width}px`
          }
        })
        
        setLogImages(images);
      }
    }
  }

  return(
    <PaperContainer width={640}>
      <LoaderContainer updateData={getImages} isPending={() => setPending(!pending)} isError={() => {setPending(!error)}}>
        <Carousel images={logImages} style={{ height: height, width: width }} />
        <StyledButton value={0} onClick={getImages} color='primary' variant="outlined" disabled={pending}>
          <Typography>Update</Typography>
        </StyledButton>
      </LoaderContainer>
    </PaperContainer>
  )
}

export default LogImageList;