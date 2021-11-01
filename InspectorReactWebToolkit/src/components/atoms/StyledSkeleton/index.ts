import Skeleton from '@mui/material/Skeleton';
import { Theme, alpha } from '@mui/material/styles';

import withStyles from '@mui/styles/withStyles';

const StyledSkeleton = withStyles((theme: Theme) => ({
    wave: {
        '&::after': {
            background: `linear-gradient(0.25turn, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.3)})`
        }
    },
    withChildren: {},
    rect: {
        backgroundColor: theme.palette.primary.main
    },
}))(Skeleton)

export default StyledSkeleton;