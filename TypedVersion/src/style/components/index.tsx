import React from 'react'
import clsx from 'clsx';
import { makeStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Image, { ImageProps } from 'material-ui-image'

import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({

}));

const StyledSlider = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.main,
        height: 8
      },
      thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -12,
        marginLeft: -12,
        boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
          boxShadow: '#ccc 0 2px 3px 1px',
        },
        '& .bar': {
          // display: inline-block !important;
          height: 9,
          width: 1,
          backgroundColor: 'currentColor',
          marginLeft: 1,
          marginRight: 1,
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 8px)',
        top: -32,
        '& *': {
          background: theme.palette.secondary.main,
          color: theme.palette.common.white,
        },
      },
      track: {
        height: 6,
        borderRadius: 4,
      },
      rail: {
        height: 4,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
      },
      mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
      },
      markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
}))(Slider);

const StyledSpinner = withStyles((theme: Theme) => ({

}))(CircularProgress)

const StyledSkeleton = withStyles((theme: Theme) => ({
  root: {},
  wave: {
      '&::after': {
          background: `linear-gradient(0.25turn, ${fade(theme.palette.primary.main, 0.3)}, ${fade(theme.palette.secondary.main, 0.8)}, ${fade(theme.palette.primary.main, 0.3)})`
      }
  },
  withChildren: {},
  rect: {
      backgroundColor: theme.palette.primary.main
  },
}))(Skeleton)

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: 'inherit',
    },
    badge: {
      right: 15,
      top: 5,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

const StyledButton = withStyles((theme) => ({
}))(Button);

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  checkedIcon?: string;
  icon?: string;
  focusVisible?: string;
}

interface StyledSwitchProps extends SwitchProps {
  classes: Styles;
}

interface StyledCheckBoxProps extends CheckboxProps {
  classes: Styles;
}

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
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
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
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

const StyledRadioButton = withStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
}))(Radio)

const _StyledToggleButton = withStyles((theme) => ({
}))(ToggleButton);

const StyledToggleButton = (props) => {
  return(
      <_StyledToggleButton 
      //startIcon = {props.pending? <CircularProgress size={20}/> : ''}
      {...props}
      >
          {props.children}
      </_StyledToggleButton>
  )
}

const StyledCheckBox = withStyles((theme: Theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
}))(({ classes, ...props } : StyledCheckBoxProps) => {
  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
});

const StyledImage = (props: ImageProps) => {
  return (
    <Image
      {...props}
    />
  );
}

StyledSlider.displayName = 'StyledSlider'
StyledSpinner.displayName = 'StyledSpinner'
StyledSkeleton.displayName = 'StyledSkeleton'
StyledBadge.displayName = 'StyledBadge'
StyledButton.displayName = 'StyledButton'
StyledSwitch.displayName = 'StyledSwitch'
StyledRadioButton.displayName = 'StyledRadioButton'
StyledToggleButton.dispayName = 'StyledToggleButton'
StyledCheckBox.displayName = 'StyledCheckBox'
StyledImage.displayName = 'StyledImage'

export {
  StyledSlider,
  StyledSpinner,
  StyledSkeleton,
  StyledBadge,
  StyledButton,
  StyledSwitch,
  StyledRadioButton,
  StyledToggleButton,
  StyledCheckBox,
  StyledImage
}