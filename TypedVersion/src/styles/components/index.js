import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Image from 'material-ui-image'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import Tab from '@material-ui/core/Tab';

import { rgba } from 'Utils/css-utils';
import theme from 'Style/theme';

const useStyles = makeStyles(theme => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.7em'
        },
        '*::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.secondary.light,
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.secondary.main,
          outline: '1px solid slategrey'
        }
    },
    whiteText:{
        color: theme.palette.common.white
    },
    blackText:{
        color: theme.palette.common.black
    },
    warningColorText:{
        color: theme.palette.warning.main
    },
    successColorText: {
        color: theme.palette.success.main
    },
    resize:{
        fontSize: '1.2rem',
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
        margin: theme.spacing(1)
        },
        '& button': {
        margin: theme.spacing(1)
        },
    },
    hideContainer: {
        display: 'none'
    },
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '98%',
        maxWidth: '640px',
        padding: '5px 5px',
        alignItems: 'center'
    },
    flexColumn: {
        flexBasis: '33.33%',
    },
    flexColumnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        padding: '5px 5px'
    },
    scrollContainer: {
        display: 'block',
        overflowY: 'scroll',
        overflowX: 'hidden'
    },
    barColorPrimaryOk: {
        backgroundColor: theme.palette.success.main
    },
    barColorPrimaryBad: {
        backgroundColor: theme.palette.error.main
    },
    container: {
        display: 'block',
        maxHeight: '480px',
        maxWidth: '640px',
        margin: '0 auto',
        position: 'relative',
        color: theme.palette.common.white
    },
    settings: {
        display: props => props.show? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignCenter: 'center',
        maxWidth: '640px',
        //margin: '0 auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        padding: '10px 0px',
        '& button': {
            marginLeft: theme.spacing(2)
        }
    },
    settingsButton: {
        position: 'absolute',
        width:' 100px',
        height: '100px',
        top: '380px',
        left: '0',
        backgroundColor: rgba('#557179', 0),
        border: 'none',
        outline: 'none'
    },
    viewer: {
        position: 'relative',
        display: 'flex',
        margin: '0 auto',
        width: props => props.viewerWidth || '640px',
        height: props => props.viewerHeight || '480px',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        '& .image-gallery': {
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
            width: '100%'
        },
    },
    camImage: {
        position: 'absolute',
        height: '440px',
        width: '640px',
    },
    camStat: {
        position: 'absolute',
        height: '100%',
        width: '40%',
        top: '0',
        left: '0',
        '& div': {
            padding: '20px 20px',
            backgroundColor:  theme.palette.type === 'light' ? rgba(theme.palette.common.black, 0.3) : rgba(theme.palette.common.white, 0.3),
            '& h6': {
                color: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
                margin: 0,
            },
            '& hr': {
                border: `1px solid ${theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black}`
            }
        },
        '& table': {
            textAlign: 'left',
            fontFamily: "Trebuchet MS, Arial, Helvetica, sans-serif",
            borderCollapse: 'collapse',
            width: '100%',
            color:  theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
            fontSize: props => props.error? '12px' : '8px',
        }
    },
    refNavbar: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
        color: theme.palette.common.white,
        '& .drop-down': {
            backgroundColor: theme.palette.type === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.primary.main
            },
            '&__button': {
                backgroundColor: theme.palette.type === 'light' ? theme.palette.secondary.main : theme.palette.primary.main,
                color: theme.palette.common.white,
                '& a': {
                    color: theme.palette.common.white,
                },
                '& a.active': {
                    backgroundColor: theme.palette.common.white
                },
                '&:focus': {
                    backgroundColor: theme.palette.common.white
                }
            },
        },
        '& .drop-down--disabled': {
            backgroundColor: rgba(theme.palette.primary.main, 0.5),
            color: rgba(theme.palette.primary.light, 0.5),
        },
        
        '& .drop-down__items': {
            backgroundColor: 'red',
            '& .drop-down__item': {
                backgroundColor: 'yellow',
            }
        },
    },
    modal: {
        //position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const StyledTab = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
    },
    selected: {
        color: `${theme.palette.common.white}`,
        backgroundColor: rgba(theme.palette.primary.main, 0.3),
    },
}))(Tab);

const StyledIconButton = withStyles((theme) => ({
    root: {
        color: theme.palette.common.white,
        //backgroundColor: 'white',
        // '&:hover': {
        //     backgroundColor: 'white',
        // }
    },
    disabled: {
        backgroundColor: rgba(theme.palette.primary.main, 0.7)
    },
    colorPrimary: {
        backgroundColor: theme.palette.primary.main
    },
    colorSecondary: {
        backgroundColor: theme.palette.secondary.main
    },
}))(IconButton);

// Line Progress Bar for CamViewer Page
const BorderLinearProgress = withStyles((theme) => ({
    root: {
        position: 'absolute',
        left: '0',
        top: '410px',
        width: '100%',
        height: '20px',
        borderRadius: 5,
        maxWidth: '640px',
        backgroundColor: theme.palette.primary.main,
    },
    colorPrimary: {
        backgroundColor: theme.palette.secondary.light,
    },
    bar: {
        borderRadius: 5,
    }
}))(LinearProgress);

const StyledViewerImage = withStyles((theme) => ({
    
}))(Image)

const _StyledButton = withStyles((theme) => ({
    root: {
        //background: `linear-gradient(45deg, ${theme.palette.secondary.light} 30%, ${theme.palette.secondary.main} 90%)`,
        backgroundColor: `${rgba(theme.palette.secondary.main, 1.0)}`,
        borderRadius: 3,
        border: `1px solid ${rgba(theme.palette.primary.main, 1.0)}`,
        height: 48,
        padding: '0 10px',
        boxShadow: `0 3px 5px 2px ${rgba(theme.palette.primary.main, 0.8)}`,
        color: theme.palette.type === 'light'? rgba(theme.palette.common.white, 1.0) : rgba(theme.palette.common.black, 1.0),
    },
    disabled: {
        backgroundColor:  rgba(theme.palette.common.white, 0.3),
        color: rgba(theme.palette.common.white, 0.3),
    },
    endIcon: {
        margin: 0,
        color: theme.palette.type === 'light'? rgba(theme.palette.common.black, 1.0) : rgba(theme.palette.common.white, 1.0),
    }
}))(Button);

const _StyledToggleButton = withStyles((theme) => ({
    root: {
        //background: `linear-gradient(45deg, ${theme.palette.secondary.light} 30%, ${theme.palette.secondary.main} 90%)`,
        background: `${rgba(theme.palette.secondary.main, 1.0)}`,
        borderRadius: 5,
        border: `1px solid ${rgba(theme.palette.common.white, 1.0)}`,
        color: theme.palette.type === 'light'? rgba(theme.palette.common.white, 1.0) : rgba(theme.palette.common.black, 1.0),
        height: 45,
        padding: '0 10px',
        boxShadow: `0 3px 5px 2px ${rgba(theme.palette.primary.main, 0.8)}`,
    },
    label: {
        color: theme.palette.type === 'light'? rgba(theme.palette.common.white, 1.0) : rgba(theme.palette.common.black, 1.0),
    },
    disabled: {
        backgroundColor: rgba(theme.palette.common.white, 0.4),
        border: 'none'
    },
    selected: {
        color: theme.palette.type === 'light'? rgba(theme.palette.common.black, 1.0) : rgba(theme.palette.common.white, 1.0),
    },
    // endIcon: {
    //     margin: 0,
    //     color: theme.palette.type === 'light'? rgba(theme.palette.common.black, 1.0) : rgba(theme.palette.common.white, 1.0),
    // },
}))(ToggleButton);

const StyledButton = (props) => {
    return(
        <_StyledButton 
        startIcon = {props.pending? <CircularProgress size={20}/> : ''}
        {...props}
        >
            {props.children}
        </_StyledButton>
    )
}

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

const StyledSelector = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.common.white,
        "&:focus": {
            backgroundColor: theme.palette.common.white
        }
    },
    select: {
        backgroundColor: theme.palette.common.black
    },
    selectMenu: {
        backgroundColor: theme.palette.common.white
    },
    filled: {
        backgroundColor: theme.palette.common.white
    },
    outlined: {
        backgroundColor: theme.palette.common.white
    },
    // inputProps: {
    //     classes: {
    //         root: {
    //             backgroundColor: theme.palette.common.white
    //         },
    //         //icon: classes.icon,
    //     },
    // }
}))(Select)

const StyledTextField = withStyles((theme) => ({
    root: {
        backgroundColor: 'white',
        padding: '5px 0px',
        margin: '5px 5px',
        '& .MuiTextField-root': {
            fontSize: 12,
            backgroundColor: 'white'
        },
        '& label': {
            paddingBottom: '5px'
        },
        '& label.Mui-focused': {
          color: theme.palette.common.black,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: theme.palette.common.black,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'red',
            backgroundColor: 'white'
          },
          '&:hover fieldset': {
            borderColor: 'yellow',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.common.black,
          },
        },
      },
}))(TextField)

// const marks = [
//     {
//       value: 0,
//     },
//     {
//       value: 20,
//     },
//     {
//       value: 37,
//     },
//     {
//       value: 100,
//     },
//   ];

const _StyledSlider = withStyles((theme) => ({
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

function AirbnbThumbComponent(props) {
    return (
        <span {...props}>
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
        </span>
    );
}

const StyledSliderTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        maxWidth: 100,
        fontSize: theme.typography.pxToRem(12),
        //border: '1px solid #dadde9',
    }
}))(Tooltip)

function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <StyledSliderTooltip open={open} enterTouchDelay={0} placement="top" title={value} arrow>
            {children}
      </StyledSliderTooltip>
    );
  }

// class StyledSlider extends React.Component {
//     render() {
//         <_StyledSlider 
//             ValueLabelComponent={ValueLabelComponent}
//             ThumbComponent={AirbnbThumbComponent} 
//             valueLabelDisplay="auto" 
//             {...this.props}
//         />
//     }
// }

const StyledSlider = React.forwardRef((props, ref) => {
    return (
        <_StyledSlider 
            //ValueLabelComponent={ValueLabelComponent} 
            //ThumbComponent={AirbnbThumbComponent} 
            valueLabelDisplay="auto" 
            innerRef={ref}
            {...props}
        />
)});

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
  }))(({ classes, ...props }) => {
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

const StyledSpinner = withStyles({
    // root: {

    // },
    // static: {
        
    // },
    colorPrimary: {
        color: theme.palette.common.white
    },
    colorSecondary: {
        color: theme.palette.common.black
    },

})(CircularProgress)

const StyledAccordion = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
        '&$expanded': {
          margin: 'auto',
        },
      },
      expanded: {},
}))(Accordion)

const StyledAccordionSummary = withStyles((theme) => ({
    expandIcon: {
        color: theme.palette.common.white,
    }
}))(AccordionSummary)

const StyledSkeleton = withStyles((theme) => ({
    root: {},
    wave: {
        '&::after': {
            background: `linear-gradient(0.25turn, ${rgba(theme.palette.primary.main, 0.3)}, ${rgba(theme.palette.secondary.main, 0.8)}, ${rgba(theme.palette.primary.main, 0.3)})`
        }
    },
    withChildren: {},
    rect: {
        backgroundColor: theme.palette.primary.main
    },
}))(Skeleton)

export {
    useStyles, 
    BorderLinearProgress, 
    StyledViewerImage, 
    StyledButton, 
    StyledToggleButton,
    StyledSelector, 
    StyledTextField,
    StyledSlider,
    StyledSwitch,
    StyledSpinner,
    StyledAccordion,
    StyledAccordionSummary,
    StyledIconButton,
    StyledSkeleton,
    StyledTab
}