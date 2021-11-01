import Select from "@mui/material/Select";
import { Theme } from '@mui/material/styles';

import withStyles from '@mui/styles/withStyles';

const StyledSelector = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.common.white,
        "&:focus": {
            backgroundColor: theme.palette.common.white
        }
    },
    select: {
        backgroundColor: theme.palette.common.black
    },
    selectMenu: {
        backgroundColor: theme.palette.common.white
    },
    filled: {
        backgroundColor: theme.palette.common.white
    },
    outlined: {
        backgroundColor: theme.palette.common.white
    },
    // inputProps: {
    //     classes: {
    //         root: {
    //             backgroundColor: theme.palette.common.white
    //         },
    //         //icon: classes.icon,
    //     },
    // }
}))(Select)

export default StyledSelector;