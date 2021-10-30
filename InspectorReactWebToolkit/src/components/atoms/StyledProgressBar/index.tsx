import React from 'react'
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';

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