import Slider from '@material-ui/core/Slider';
import { withStyles, Theme } from '@material-ui/core/styles';

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

export default StyledSlider;