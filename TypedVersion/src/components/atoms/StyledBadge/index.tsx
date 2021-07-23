import Badge from '@material-ui/core/Badge';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

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

export default StyledBadge;