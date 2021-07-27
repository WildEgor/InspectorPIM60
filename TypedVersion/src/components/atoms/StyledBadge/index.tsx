import React from "react";

import Badge from '@material-ui/core/Badge';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

const _StyledBadge = withStyles((theme: Theme) =>
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

const StyledBadge = (prop) => {
  const { children } = prop;
  return <_StyledBadge {...prop} >{children}</_StyledBadge>
}

export default StyledBadge;