import React, { useEffect, useState } from 'react';
import { useInterval } from "react-use";

import StyledImage from "../../atoms/StyledImage";
import StyledBadge from "../../atoms/StyledBadge";
import { handlePromise } from "../../../core/utils/http-utils";

interface Props {
    getImage?: () => Promise<any>,
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
        refreshTime = 700,
        isAutoUpdate = true
    } = props;
    const [imageURL, setImageURL] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(refreshTime);

    const getImageURL = async () => {
        setPending(true);
        setError(false);

        const [error, response] = await handlePromise(getImage());
        if (!error && response) {
            setImageURL(response);
            setPending(false);
            setError(false);
        } else {
            setPending(false);
            setError(true); 
        }
    }

    useInterval(
        () => {
        if (!pending)
            getImageURL();
        },
        isAutoUpdate ? delay : null
    );

    useEffect(() => {
        getImageURL();
    }, [])

    return(
        <>
            <StyledBadge color="secondary" badgeContent=" " invisible={!error}></StyledBadge>
            <StyledImage
                src={imageURL}
                //errorIcon={<div>Error</div>}
            />
        </>
    )
}