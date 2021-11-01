import React from "react";

import Badge from '@mui/material/Badge';
import { Theme } from '@mui/material/styles';

import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';

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