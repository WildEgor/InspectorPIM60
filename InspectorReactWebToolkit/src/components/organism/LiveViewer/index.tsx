
import { Grid, InputLabel, makeStyles, MenuItem, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import StyledButton from 'Src/components/atoms/StyledButton';
import ImageBox from 'Src/components/molecules/ImageBox';
import PaperContainer from 'Src/components/molecules/PaperContainer';
import StyledSelector from 'Src/components/atoms/StyledSelector';
import StyledInput from 'Src/components/atoms/StyledInput';
import { EImageSize, EOverlay } from 'Src/core/services/inspector/inspector.interface';
import StyledProgressBar from 'Src/components/atoms/StyledProgressBar';
import { withStyles } from '@material-ui/styles';

interface Props {
    showProgress?: boolean,
    showSettings?: boolean,
    width?: number,
    height?: number,
    getImage: (id: string, s?: EImageSize, type?: EOverlay) => Promise<string>
    getImageStatistic?: (id: string) => Promise<string>,
    isError?: (error: string) => void,
}

type TSelector<T> = {
    name: string,
    value: T,
}

const LiveViewer = (props: Props) => {
    const refreshTimes = [80, 100, 250, 500, 1000];
    const imageSizeValues: TSelector<EImageSize>[] = 
        [
            {
                name: 'SMALL',
                value: EImageSize.SMALL,
            },
            {
                name: 'ORIGINAL',
                value: EImageSize.ORIG,
            },
        ]
    const overlayValuse: TSelector<EOverlay>[] = 
        [
            {
                name: 'HIDE',
                value: EOverlay.HIDE,
            },
            {
                name: 'SHOW',
                value: EOverlay.SHOW,
            },
            {
                name: 'SIMPLE',
                value: EOverlay.SIMPLE,
            }
        ]
    const progressColors = {
        ERROR: '#FF0000',
        SUCCESS: '#A0D231'
    }

    const { showProgress = true, showSettings = true, getImageStatistic, width = 630, height = 480, getImage } = props;
    const [imgProgressColor, setImgProgressColor] = useState({ clr: '#FF0000' });
    const [selectorValue, setSelectorValue] = useState<number>(100);
    const [imageSizeSelectorValue, setImageSizeSelectorValue] = useState<number>(0)
    const [overlaySizeSelectorValue, setOverlaySizeSelectorValue] = useState<number>(0)
    const [imagePercentage, setImagePercentage] = useState<number>(0)
    const [isPaused, setIsPaused] = useState(false)

    const handleSpeedChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectorValue(event.target.value as number);
    };

    const handleImageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setImageSizeSelectorValue(event.target.value as number);
    };

    const handleOverlayChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOverlaySizeSelectorValue(event.target.value as number);
    };

    const processStatistic = async (guid: string) => {
        if (getImageStatistic) {
            const stat = await getImageStatistic(guid)
            if (stat) {
                const [score, des] = Object.keys(stat).filter(key => (key === 'OBJECT_LOC.SCORE' || key === 'IMAGE_DECISION')).map(i => parseInt(i));
                setImgProgressColor({ clr: score === 2? progressColors.SUCCESS : progressColors.ERROR })
                // setImagePercentage(Math.random() * 100)
                setImagePercentage(des)
            } 
        }
    }

    return(
        <PaperContainer width={width}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <ImageBox
                            refreshTime={selectorValue}
                            isAutoUpdate={!isPaused}
                            width={width}
                            height={height}
                            getImage={async (id) => {

                                const [image, stat] = await Promise.all([
                                    getImage(id, imageSizeValues[imageSizeSelectorValue].value, overlayValuse[overlaySizeSelectorValue].value),
                                    showProgress && processStatistic(id),
                                ])

                                // return image;
                                return 'https://via.placeholder.com/640x480.jpg';
                            }} // () => 'https://via.placeholder.com/640x480.jpg'
                        />
                    </Grid>
                    {
                        showProgress && 
                            <Grid item xs={12}>
                                <StyledProgressBar
                                    variant="determinate" 
                                    value={imagePercentage} 
                                />
                            </Grid>
                    }
                    { showSettings && <>
                    <Grid item xs={3}>
                        <FormControl>
                            <InputLabel id="demo-customized-select-label"><Typography variant={'h4'}>REQUEST RATE: </Typography></InputLabel>
                            <StyledSelector
                                style={{
                                    width: '180px',
                                }}
                                value={selectorValue}
                                onChange={handleSpeedChange}
                                input={<StyledInput />}
                            >
                                {refreshTimes.map((time) => <MenuItem key={Math.random() * time} value={time}>{time}</MenuItem>)}
                            </StyledSelector>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <InputLabel id="sdaadl"><Typography variant={'h4'}>IMAGE SIZE: </Typography></InputLabel>
                            <StyledSelector
                                style={{
                                    width: '180px',
                                }}
                                value={imageSizeSelectorValue}
                                onChange={handleImageSizeChange}
                                input={<StyledInput />}
                            >
                                {imageSizeValues.map((o, i) => <MenuItem key={o.name} value={i}>{o.name}</MenuItem>)}
                            </StyledSelector>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <InputLabel id="asdsad"><Typography variant={'h4'}>OVERLAY: </Typography></InputLabel>
                            <StyledSelector
                                style={{
                                    width: '180px',
                                }}
                                value={overlaySizeSelectorValue}
                                onChange={handleOverlayChange}
                                input={<StyledInput />}
                            >
                                {overlayValuse.map((o, i) => <MenuItem key={o.name} value={i}>{o.name}</MenuItem>)}
                            </StyledSelector>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledButton 
                            size='small'
                            value={0} 
                            onClick={() => {setIsPaused(!isPaused)}
                            } 
                            color='primary' 
                            variant="outlined"
                        >
                            {!isPaused? <Typography>PAUSE</Typography> : <Typography>START</Typography>}
                        </StyledButton>
                    </Grid></>}
            </Grid>
        </PaperContainer>
    )
}

export default LiveViewer;