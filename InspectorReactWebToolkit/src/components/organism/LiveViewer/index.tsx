
import { Card, FormHelperText, Grid, InputLabel, MenuItem, SelectChangeEvent, Typography } from '@mui/material';
import React, {useState } from 'react';
import FormControl from '@mui/material/FormControl';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StyledButton from 'Src/components/atoms/StyledButton';
import ImageBox from 'Src/components/molecules/ImageBox';
import PaperContainer from 'Src/components/molecules/PaperContainer';
import StyledSelector from 'Src/components/atoms/StyledSelector';
import StyledInput from 'Src/components/atoms/StyledInput';
import { EImageSize, EOverlay } from 'Src/core/services/inspector/inspector.interface';
import StyledProgressBar from 'Src/components/atoms/StyledProgressBar';

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
        SUCCESS: '#A0D231',
        COMMON: '#fffB'
    }

    const { showProgress = true, showSettings = true, getImageStatistic, width = 660, height = 480, getImage } = props;

    const [imgProgressColor, setImgProgressColor] = useState({ clr: progressColors.COMMON });
    const [selectorValue, setSelectorValue] = useState<number>(100);
    const [imageSizeSelectorValue, setImageSizeSelectorValue] = useState<number>(0)
    const [overlaySizeSelectorValue, setOverlaySizeSelectorValue] = useState<number>(1)
    const [imagePercentage, setImagePercentage] = useState<number>(0)
    const [isPaused, setIsPaused] = useState(false)

    const handleSpeedChange = (event: SelectChangeEvent<{ value: unknown }>) => {
        setSelectorValue(event.target.value as unknown as number);
    };

    const handleImageSizeChange = (event: SelectChangeEvent<{ value: unknown }>) => {
        setImageSizeSelectorValue(event.target.value as unknown as number);
    };

    const handleOverlayChange = (event: SelectChangeEvent<{ value: unknown }>) => {
        setOverlaySizeSelectorValue(event.target.value as unknown as number);
    };

    const processImageWithStatistic = async (id: string) => {
        const image = await getImage(id, imageSizeValues[imageSizeSelectorValue].value, overlayValuse[overlaySizeSelectorValue].value)

        let statistic = null;

        if (getImageStatistic) {
            statistic =  await getImageStatistic(id)
            const score = parseInt(statistic?.['MESSAGE.OBJECT_LOC.SCORE']);
            const des = statistic?.['MESSAGE.OBJECT_LOC.DECISION'];
            console.log(score, des)
            setImgProgressColor({ clr: (des === '1'? progressColors.SUCCESS : progressColors.ERROR) })
            setImagePercentage(score);
        } else {
            setImgProgressColor({ clr: progressColors.COMMON })
        }

        return [image, statistic];
    }

    return(
        <PaperContainer width={width}>
            <Grid 
                container 
                spacing={2} 
                alignItems="center" 
                justifyContent="center" 
                style={{ minHeight: '30vh' }}
            >
                {
                showProgress && 
                <Grid item xs={12}>
                    <StyledProgressBar
                        {...imgProgressColor}
                        variant="determinate" 
                        value={imagePercentage} 
                    />
                </Grid>
                }
                <Grid item xs={12}>
                    <Card sx={{ maxWidth: width, maxHeight: height }}>
                        <ImageBox
                            refreshTime={selectorValue}
                            isAutoUpdate={!isPaused}
                            width={width}
                            height={height}
                            getImage={async (id) => {
                                const [image, statistic] = await processImageWithStatistic(id);
                                return image;
                            }} 
                        />
                    </Card>
                </Grid>
                { 
                showSettings && <>
                <Grid item xs={2}>
                    <StyledButton 
                        startIcon={!isPaused? <PlayArrowIcon/> : <PauseIcon/>}
                        size='small'
                        value={0} 
                        onClick={() => {setIsPaused(!isPaused)}
                        } 
                        color='primary' 
                        variant="contained"
                    >
                        {isPaused? <Typography variant='h5'>START</Typography> : <Typography variant='h5'>PAUSE</Typography>}
                    </StyledButton>
                </Grid>
                <Grid item xs={3}>
                    <FormControl>
                        <FormHelperText>Request rate</FormHelperText>
                        <StyledSelector
                            color='primary'
                            style={{
                                width: '100px',
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
                        <FormHelperText>Image size</FormHelperText>
                        <StyledSelector
                            style={{
                                width: '120px',
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
                        <FormHelperText>Overlay type</FormHelperText>
                        <StyledSelector
                            style={{
                                width: '120px',
                            }}
                            value={overlaySizeSelectorValue}
                            onChange={handleOverlayChange}
                            input={<StyledInput />}
                        >
                            {overlayValuse.map((o, i) => <MenuItem key={o.name} value={i}>{o.name}</MenuItem>)}
                        </StyledSelector>
                    </FormControl>
                </Grid></>
                }
            </Grid>
        </PaperContainer>
    )
}

export default LiveViewer;