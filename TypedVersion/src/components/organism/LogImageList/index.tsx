import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import { handlePromise } from "../../../core/utils/http-utils";

import { 
  StyledImage,
  StyledSkeleton, 
  StyledBadge 
} from "../../../style/components";

interface Props {
  width?: 640 | 480,
  height?: 480 | 320,
  range: string,
  getImage: (id: number) => Promise<any>
  lockLogger: (lock?: boolean) => Promise<any>
}

interface ImageRawProps {
  maxWidth: number,
  minHeight: number
}

interface CarouselImage {
  src: string, // required
  srcset?: string, // `https://placedog.net/400/240?id=1 400w, https://placedog.net/700/420?id=1 700w, https://placedog.net/1000/600?id=1 1000w`,
  sizes?: string, // '(max-width: 1000px) 400px, (max-width: 2000px) 700px, 1000px'
  alt?: string,
  thumbnail?: string 
}

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  root: {
      flexGrow: 1,
  },
  paper: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      maxWidth: (props: ImageRawProps) => props.maxWidth,
      minHeight: (props: ImageRawProps) => props.minHeight,
  },
}),
);

const LogImageList = (props: Props) => {
  const { getImage, lockLogger, range, width = 480,  height = 320 } = props;
  const classes = useStyles({ maxWidth: width, minHeight: height });
  const [logImages, setLogImages] = useState<Array<CarouselImage>>([{
    src: ''
  }]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getImages = async () => {
    const indexes = range.split('-');
    const start = Number(indexes[0]);
    const stop = Number(indexes[1]);

    if (indexes.length && start < stop){
      setPending(true);
      setError(false);

      await handlePromise(lockLogger(true))

      console.log('START STOP', start, stop);

      const [values, error] = await handlePromise(Promise.all<string[]>(Array.from({ length: stop - start + 1 }, (_v , k)=> {
        return handlePromise(getImage(k + start));
      })))

      if(!error && values.length) {
        const images: CarouselImage[] = values.map((item: string) => {
          return {
            src: item,
            thumbnail: item
          }
        })

        console.log('Logger images: ', images);
        
        setLogImages(images);

        setPending(false);
        setError(false);
      } else {
        setPending(false);
        setError(true);
      }

      await handlePromise(lockLogger(false))
    }
  }

  useEffect(() => {
    getImages();
  }, [])

  return(
    <Paper className={classes.paper}>
        <Box display='flex' flexDirection='column'>
        <StyledBadge color="secondary" badgeContent=" " invisible={!error}/>
          {pending && <StyledImage  loading={<StyledSkeleton width={width} height={height} />} src='' />}
          {(!pending && !error) && <Carousel images={logImages} style={{ height: height, width: width }} />}
          {error && <StyledImage src='error'  onClick={getImages} errorIcon={<IconButton aria-label="update toggle"><CachedIcon/></IconButton>} />}
        </Box>
    </Paper>
  )
}

export default LogImageList;