import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

interface Props {
    width: number,
    children?: React.ReactNode;
}

interface ImageRawProps {
    maxWidth: number,
}

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  root: {
      flexGrow: 1,
  },
  paper: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      maxWidth: (props: ImageRawProps) => props.maxWidth,
      height: "100%",
  },
}),
);

const PaperContainer = (props: Props): JSX.Element => {
    const { width = 480, children} = props;
    const classes = useStyles({ maxWidth: (width + 15) });

    return(
        <Paper className={classes.paper}>
            <Box display='flex' flexDirection='column'>
                {children}
            </Box>
        </Paper>
    )
}

export default PaperContainer;
