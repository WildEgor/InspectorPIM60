import { createMuiTheme, Theme }  from '@material-ui/core/styles'

const common = {
  props: {
  MuiTypography: {
    variantMapping: {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h3',
      subtitle2: 'h4',
      body1: 'span',
      body2: 'span',
    },
  },
},
typography: {
  h1: { fontSize: '1.8rem', },
  h2: { fontSize: '1.5rem', },
  h3: { fontSize: '1.25rem', },
  h4: { fontSize: '1rem', },
  h5: { fontSize: '0.55rem', },
  h6: { fontSize: '0.45rem', },
  subtitle1: { fontSize: '0.40rem', },
  body1: {
    fontWeight: 500,
  },
  button: {
    //fontStyle: '',
  },
},
}

// define light theme colors
export const lightTheme: Theme = createMuiTheme({
  palette: {
      type: "light",
  },
  ...common
});

// define dark theme colors
export const darkTheme: Theme = createMuiTheme({
  palette: {
      type: "dark",
      common: {
        white: '#FFFFFF',
        black: '#000000'
      },
      primary: { main: '#354653' },
      secondary: {main: '#557179'},
      success: {
        main : "#bac778",
      },
  },
  ...common
});