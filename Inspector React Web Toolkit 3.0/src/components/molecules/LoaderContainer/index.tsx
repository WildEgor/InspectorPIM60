import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useState } from 'react';
import StyledBadge from "../../atoms/StyledBadge";
import StyledSkeleton from "../../atoms/StyledSkeleton";
import CachedIcon from '@material-ui/icons/Cached';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    content: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'black',
        backgroundColor: 'inherit'
     }
  }),
);

interface Props {
    updateData: () => Promise<any>;
    children: React.ReactNode;
    needUpdate?: boolean;
    isError?: (error: boolean) => void;
    isPending?: (pending: boolean) => void;
}

export default function LoaderContainer(props: Props): JSX.Element{
    const { children, updateData, needUpdate, isError, isPending } = props;

    const classes = useStyles();

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
        <>
            {pending && <StyledSkeleton animation="pulse">{children}</StyledSkeleton>}
            {!pending && error &&
            <StyledBadge anchorOrigin={{vertical: 'top', horizontal: 'right',}} color="secondary" badgeContent=" ">
                <Grid container spacing={1} alignItems="center">
                    <Grid className={classes.content} item xl container direction="row" spacing={2}>
                        {!pending && <StyledSkeleton animation={false}>{children}</StyledSkeleton>}
                    </Grid>
                    <Grid className={classes.overlay} item>
                        <IconButton aria-label="update slider" onClick={fetchData}>
                            <CachedIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </StyledBadge>
            }
            {!pending && !error && <>{children}</>}
        </>
    )
}