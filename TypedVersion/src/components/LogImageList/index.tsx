import React, { 
  useEffect, 
  useState, 
  // useContext 
} 
from 'react';

// import { StoreContext } from "../../core/store/rootStore";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
import CachedIcon from '@material-ui/icons/Cached';
import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';

import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';

import { 
  StyledImage,
  StyledSkeleton, 
  StyledBadge 
} from "../../style/components";

import { EImageSize, EOverlay, TInspectorService } from "../../core/services/inspector.service";

interface Props {
  width?: 640 | 480,
  height?: 480 | 320,
  range: string,
  scale: EImageSize,
  overlay: EOverlay,
  Inspector: TInspectorService
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
  const { Inspector, range, scale, overlay, width = 480,  height = 320 } = props;
  const classes = useStyles({ maxWidth: width, minHeight: height });
  const [logImages, setLogImages] = useState<Array<CarouselImage>>([{ src: ' '}]);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getImages = async () => {
    try {
      setPending(true);
      setError(false);

      await Inspector.setLogState(true);

      const indexes = range.split('-');
      const start = Number(indexes[0]);
      const stop = Number(indexes[1]);

      if (indexes.length && start < stop){
        const values = (await Promise.all(Array.from({ length: start + stop }, (_v , k)=> {
          return Inspector.getLogImage(k, scale, overlay)
        }))).map((item) => {
          return {
            src: (item as unknown) as string,
            thumbnail: (item as unknown) as string
          } as CarouselImage
        });


        setPending(false);
        setError(false);
        console.log('[info] Retrieve new log images: ', values);
        setLogImages(values);
        await Inspector.setLogState(false);
      }
    } catch (error) {
      console.error('[LogImageList] ', error);
      setPending(false);
      setError(true);
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