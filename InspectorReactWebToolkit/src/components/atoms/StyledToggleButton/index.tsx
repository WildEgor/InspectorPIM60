import React from 'react'
import withStyles from '@mui/styles/withStyles';
import ToggleButton from '@mui/material/ToggleButton';

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