
import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Switch, { SwitchClassKey, SwitchProps } from '@mui/material/Switch';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
    checkedIcon?: string;
    icon?: string;
    focusVisible?: string;
}

interface StyledSwitchProps extends SwitchProps {
    classes: Styles;
}

const StyledSwitch = withStyles((theme) => ({
    root: {
      width: 40,
      height: 25,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 22,
      height: 22,
    },
    track: {
      borderRadius: 20 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props } : StyledSwitchProps) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  export default StyledSwitch;