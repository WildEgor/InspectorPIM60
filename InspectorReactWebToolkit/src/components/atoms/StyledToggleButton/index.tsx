import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';

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

export default StyledToggleButton;