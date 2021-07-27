import React, { useEffect, useState } from 'react';
import { useInterval } from "react-use";
import StyledImage from "../../atoms/StyledImage";
import LoaderContainer from "../LoaderContainer";
interface Props {
    getImage: () => Promise<string>,
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
        getImage,
        width = 640,
        height = 480,
        refreshTime = 70,
        isAutoUpdate = true
    } = props;
    const [imageURL, setImageURL] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [updateEvent, setUpdateEvent] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(refreshTime);

    const getImageURL = async () => {
        const response = await getImage();
        if (response) setImageURL(response);
    }

    useInterval(
        () => {
        if (!pending)
            setUpdateEvent(!updateEvent)
        }
        ,
        isAutoUpdate ? delay : null
    );

    return(
        <LoaderContainer updateData={getImageURL} isPending={setPending} needUpdate={updateEvent}>
            <StyledImage
                src={imageURL}
                errorIcon={<> <p> X </p> </>}
                imageStyle={{ width, height }}
            />
        </LoaderContainer>
    )
}