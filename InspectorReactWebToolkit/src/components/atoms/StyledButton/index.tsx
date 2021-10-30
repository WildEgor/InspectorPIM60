import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button, { ButtonClassKey, ButtonProps } from '@material-ui/core/Button';

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