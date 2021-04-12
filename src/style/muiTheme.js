import { createMuiTheme }  from '@material-ui/core/styles'
import theme from './theme';

const muiTheme = createMuiTheme({
    palette: {
      common: {
        white: '#FFFFFF',
        black: '#000000'
      },
      primary: { main: '#354653' },
      secondary: {main: '#557179'}
    },
    props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h2',
        h2: 'h2',
        h3: 'h2',
        h4: 'h2',
        h5: 'h2',
        h6: 'h2',
        subtitle1: 'h2',
        subtitle2: 'h2',
        body1: 'span',
        body2: 'span',
      },
    },
  },
  typography: {
    h4: {fontSize: '0.85rem',},
    h5: {
      fontSize: '0.75rem',
    },
    h6: {
      fontSize: '0.45rem',
    },
    subtitle1: {
      fontSize: '0.40rem',
    },
    body1: {
      fontWeight: 500,
    },
    button: {
      //fontStyle: '',
    },
  },
})
export default muiTheme