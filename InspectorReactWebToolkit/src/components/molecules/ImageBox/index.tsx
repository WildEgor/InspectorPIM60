import React, { useEffect, useState } from 'react';
import { useInterval } from "react-use";
import StyledImage from "../../atoms/StyledImage";
import { v4 as uuidv4 } from 'uuid';

interface Props {
    guid?: (guid: string) => void,
    getImage: (id: string) => Promise<string> | string,
    width?: number,
    height?: number,
    refreshTime?: number,
    isAutoUpdate?: boolean
}

interface ImageRawProps {
    maxWidth: number,
    minHeight: number
}

export default function ImageBox(props: Props) {
    const { 
        guid,
        getImage,
        width = 480,
        height = 320,
        refreshTime = 500,
        isAutoUpdate = true
    } = props;
    const [imageURL, setImageURL] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [updateEvent, setUpdateEvent] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(refreshTime);

    const getImageURL = async () => {
        const id = uuidv4();
        guid && guid(id);
        const response = await getImage(id);
        if (response) setImageURL(response);
    }

    useInterval(
        async () => {
            setPending(true);
            if (!pending) {
                await getImageURL()
                setUpdateEvent(!updateEvent)
                setPending(false);
            }   
        }
        ,
        isAutoUpdate ? delay : null
    );

    useEffect(() => {
        setDelay(refreshTime);
    }, [isAutoUpdate])

    return(
        <StyledImage
            cover
            animationDuration={100}
            src={imageURL}
            errorIcon={<> <p> X </p> </>}
            imageStyle={{ width, height }}
            disableSpinner={true}
            disableError={true}
            disableTransition={true}
            style={{
                paddingTop: 'calc(80%)'
            }}
        />
    )
}