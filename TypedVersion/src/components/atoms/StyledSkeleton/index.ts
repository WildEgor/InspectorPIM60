import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles, Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const StyledSkeleton = withStyles((theme: Theme) => ({
    wave: {
        '&::after': {
            background: `linear-gradient(0.25turn, ${fade(theme.palette.primary.main, 0.3)}, ${fade(theme.palette.secondary.main, 0.8)}, ${fade(theme.palette.primary.main, 0.3)})`
        }
    },
    withChildren: {},
    rect: {
        backgroundColor: theme.palette.primary.main
    },
}))(Skeleton)

export default StyledSkeleton;