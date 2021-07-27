import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useState } from 'react';
import StyledBadge from "../../atoms/StyledBadge";
import StyledSkeleton from "../../atoms/StyledSkeleton";
import CachedIcon from '@material-ui/icons/Cached';

interface Props {
    updateData: () => Promise<any>;
    children: React.ReactNode;
    needUpdate?: boolean;
    isError?: (error: boolean) => void;
    isPending?: (pending: boolean) => void;
}

export default function LoaderContainer(props: Props): JSX.Element{
    const { children, updateData, needUpdate, isError, isPending } = props;
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    async function fetchData() {
        setPending(true);
        isError && isError(false);
        isPending && isPending(true)
        try {
            await updateData();
            setError(false);
            setPending(false);
            isPending && isPending(false)
        } catch (error) {
            setPending(false);
            setError(true);
            isError && isError(true);
            isPending && isPending(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [needUpdate])

    return(
        <div>
            {pending && <StyledSkeleton animation="pulse">{children}</StyledSkeleton>}
            {!pending && error &&
                <>
                    <StyledBadge overlap="rectangular" anchorOrigin={{vertical: 'top', horizontal: 'right',}} color="secondary" badgeContent=" ">
                        <IconButton aria-label="update slider" onClick={() => { 
                            fetchData()
                        }}>
                        <CachedIcon/>
                        </IconButton>
                        {!pending && children}
                    </StyledBadge>
                </>
            }
            {!pending && !error && <>{children}</>}
        </div>
    )
}