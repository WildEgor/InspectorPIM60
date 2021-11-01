import React from 'react'
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

const StyledProgressBar = withStyles((theme: Theme) => ({
  root: {
    height: '30px',
    transition: 'none',
  },
}))(({  ...props } : LinearProgressProps) => {
  return (
    <LinearProgress
      {...props}
    />
  );
});

export default StyledProgressBar;