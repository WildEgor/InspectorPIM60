import React, { useEffect, useState, Suspense } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy';
import ImageGallery from 'react-image-gallery';
import SelectOverlay from 'Components/SelectOverlay';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import UpdateIcon from '@material-ui/icons/Update';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import actionTypes from 'Store/actionTypes';
const {logImagesTypes} = actionTypes

import config from 'Src/config';
import './style.scss';

import {
    useStyles, 
    StyledButton,
    StyledSwitch,
    StyledAccordion,
    StyledAccordionSummary,
    StyledSkeleton } from 'Style/components';
import Spinner from 'Components/Spinner';

const CamLogger = () => {
    const [changeLogImages, setChangeLogImages] = useState(false)
    const countLogImages = config.CAMLOGGER.countLogImages;
    const [imgConfig, setImgConfig] = useState({ count: countLogImages, cmd: 'ShowOverlay', type: changeLogImages? 'liveImageLog' : 'camLog'})
    //const [tosterId, setTosterId] = useState({})

    const classes = useStyles({ viewerWidth: '640px', viewerHeight: '430px' })

    const commands = useStoreState(state => state.logImages.commands);

    const loadLogImages = useStoreActions(actions => actions.logImages.loadLogImages);
    const updateLogImages = useStoreActions(actions => actions.logImages.updateLogImages);

    const handleOverlay = (newOverlay) => {
        if (newOverlay !== null) {
            loadLogImages({ ...imgConfig, cmd: newOverlay})
            setImgConfig({ ...imgConfig, cmd: newOverlay});
        }
    };

    useEffect(() => {
        updateLogImages(imgConfig)
        //loadLogImages(imgConfig)
        // return () => {
        //     updateLogImages(imgConfig)
        // };
    }, [])

    // const _handleImageError = (event) => {
    //     // if (this.props.defaultImage &&
    //     //     event.target.src.indexOf(this.props.defaultImage) === -1) {
    //     //   event.target.src = this.props.defaultImage;
    //     // }
    // }

    // const _myImageGalleryRenderer = (item) => {
    //     return (
    //       <div className='image-gallery-image'>
    //         <img
    //             src={item.original}
    //             alt={item.originalAlt}
    //             srcSet={item.srcSet}
    //             sizes={item.sizes}
    //             //onLoad={this.props.onImageLoad}
    //             onError={(e) => _handleImageError(e)}
    //         />
    
    //         {
    //           item.statistic && <div className='image-gallery-description'>{JSON.stringify(item.statistic)}</div>
    //         }
    //         {
    //             item.description && (
    //                 <span className="image-gallery-description">
    //                     {item.description}
    //                 </span>
    //             )
    //         }
    //       </div>
    //     )
    //   }

    return (
        <div className={classes.container}>
            <div className={classes.viewer}>
            {
                (commands[logImagesTypes.LOAD_IMAGE].loading || commands[logImagesTypes.LOAD_IMAGE].error || commands[logImagesTypes.LOAD_IMAGE].data[imgConfig.type].length <= 1)?
                <StyledSkeleton variant="rect" width={640} height={480} animation='wave' component='div'/>
                :
                <ImageGallery 
                    //renderItem={(item) => _myImageGalleryRenderer(item)}
                    renderPlayPauseButton={() => <button onClick={() => {updateLogImages(imgConfig)}} type="button" className="image-gallery-icon image-gallery-play-button" aria-label="Play or Pause Slideshow"><svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>}
                    items={commands[logImagesTypes.LOAD_IMAGE].data[imgConfig.type]}
                    lazyLoad 
                    thumbnailPosition='left'
                    showFullscreenButton={false} 
                    useBrowserFullscreen={false} 
                    showPlayButton={true}
                    showBullets={false}
                    startIndex={0}
                    showIndex
                    indexSeparator='/'
                    slideDuration={200}
                />
            }
            </div>
            <StyledAccordion TransitionProps={{ unmountOnExit: true }}>
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Дополнительные настройки</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
            <div className={classes.flexContainer}>
                <div className={classes.flexContainer}>
                <Typography component="div">
                    <Typography>Тип логгера</Typography>
                    <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item><h6>Встроенный</h6></Grid>
                    <Grid item>
                        <StyledSwitch
                            disabled={commands[logImagesTypes.LOAD_IMAGE].loading}
                            checked={changeLogImages}
                            onChange={(e) => {
                                setChangeLogImages(e.target.checked)
                                setImgConfig({...imgConfig, type: !e.target.checked? 'camLog' : 'liveImageLog'})
                                loadLogImages({...imgConfig, type: !e.target.checked? 'camLog' : 'liveImageLog'})
                            }}
                            name="checkedB"
                        />
                    </Grid>
                    <Grid item><h6>Программный</h6></Grid>
                    </Grid>
                </Typography>
                <div className={classes.flexColumn}>
                        <StyledButton
                            disabled={commands[logImagesTypes.LOAD_IMAGE].loading}
                            startIcon={<UpdateIcon />}
                            onClick={() => updateLogImages(imgConfig)}
                        >
                            <h6>Загрузить</h6>
                        </StyledButton>
                    {/* <div className={changeLogImages? classes.hideContainer : classes.flexContainer}>
                        <SelectOverlay
                            value={imgConfig.cmd}
                            onChange={handleOverlay}
                            disabled={commands[logImagesTypes.LOAD_IMAGE].loading}
                        />
                    </div> */}
                    </div>
                </div>
                </div>
            </AccordionDetails>
            </StyledAccordion>  
        </div>
    )
}

export default CamLogger