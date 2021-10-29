import React, { useEffect, useState } from 'react';
import { useInterval } from "react-use";
import StyledImage from "../../atoms/StyledImage";
import LoaderContainer from "../LoaderContainer";
import { v4 as uuidv4 } from 'uuid';
interface Props {
    getImage: (id: string) => Promise<string>,
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
        const response = await getImage(id);
        if (response) setImageURL(response);
    }

    useInterval(
        async () => {
            // if (!pending) {
                await getImageURL()
                setUpdateEvent(!updateEvent)
            // }   
        }
        ,
        isAutoUpdate ? delay : null
    );

    return(
        // <LoaderContainer updateData={getImageURL} isPending={setPending}>
            <StyledImage
                cover
                animationDuration={100}
                src={imageURL}
                errorIcon={<> <p> X </p> </>}
                imageStyle={{ width, height }}
                disableSpinner={true}
                disableError={true}
                disableTransition={true}
            />
        // </LoaderContainer> 
    )
}