import React from 'react'
import { createStyles, makeStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Theme, useTheme } from '@mui/system';

interface ICustomProps extends LinearProgressProps {
  clr: string
}

// const StyledProgressBar = withStyles((theme: Theme) => ({
//   root: {
//     height: '30px',
//     transition: 'none',
//   },
//   colorPrimary: {
//     backgroundColor: '#00695C',
//   },
//   barColorPrimary: {
//     backgroundColor: '#B2DFDB',
//   }
// }))(({  ...props } : LinearProgressProps) => {
//   const { classes } = props;

//   return (
//     <LinearProgress
//       classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
//       {...props}
//     />
//   );
// });

// export default StyledProgressBar;

const StyledProgressBar: React.FC<ICustomProps> = ({ value, clr }) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      height: 10,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.mode === 'light'? '#68889F' : '#354653'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: clr
    }
  }));

  const classes = useStyles();
 

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      classes={{
        root: classes.root,
        colorPrimary: classes.colorPrimary,
        bar: classes.bar
      }}
    />
  );
};

export default StyledProgressBar;