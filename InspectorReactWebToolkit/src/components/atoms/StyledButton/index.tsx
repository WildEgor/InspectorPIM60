import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Button, { ButtonClassKey, ButtonProps } from '@mui/material/Button';

interface Styles extends Partial<Record<ButtonClassKey, string>> {
    component: any,
}
  
interface StyledButtonProps extends ButtonProps {
    classes: Styles;
}

const StyledButton = withStyles((theme) => ({
  
}))(({ classes, ...props } : StyledButtonProps) => {
    return (
      <Button
        className={classes.root}
        color="primary"
        {...props}
      />
    );
  });

export default StyledButton;