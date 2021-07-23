import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useState } from 'react';
import StyledBadge from "../../atoms/StyledBadge";
import StyledSkeleton from "../../atoms/StyledSkeleton";
import CachedIcon from '@material-ui/icons/Cached';

interface Props {
    updateData: () => Promise<any>;
    children: React.ReactNode;
    refreshTime?: number;
    isAutoUpdate?: boolean;
    isError?: (error: boolean) => void;
    isPending?: (pending: boolean) => void;
}

export default function ImageBox(props: Props): JSX.Element{
    const { children, updateData } = props;
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    async function fetchData() {
        setPending(true);
        setError(false);
        try {
            await updateData();
            setPending(false);
            setError(false);
        } catch (error) {
            setPending(false);
            setError(true);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return(
        <div>
            {pending && <StyledSkeleton animation="pulse">{children}</StyledSkeleton>}
            {error &&
                <>
                    <StyledBadge color="secondary" badgeContent=" "/>
                    <IconButton aria-label="update slider" onClick={() => { 
                        fetchData()
                    }}>
                    <CachedIcon/>
                    </IconButton>
                </>
            }
            {!pending && !error && <>{children}</>}
        </div>
    )
}