import { createTheme, Theme, adaptV4Theme } from '@mui/material/styles';

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
  h1: { fontSize: '2.8rem', fontWeight: 700 },
  h2: { fontSize: '2.2rem', fontWeight: 700 },
  h3: { fontSize: '1.8rem', fontWeight: 600 },
  h4: { fontSize: '1.2rem', fontWeight: 600 },
  h5: { fontSize: '0.8rem', fontWeight: 500 },
  h6: { fontSize: '0.6rem', fontWeight: 500 },
  subtitle1: { fontSize: '0.50rem', fontWeight: 400 },
  body1: {
    fontWeight: 500,
  },
  button: {
    //fontStyle: '',
  },
},
}

// define light theme colors
export const lightTheme: Theme = createTheme(adaptV4Theme({
  palette: {
      mode: "light",
      common: {
        white: '#FFFFFF',
        black: '#3C3B3B'
      },
      primary: { main: '#68889F' },
      secondary: { main: '#88A9B3' },
      success: {
        main : "#bac778",
      },
  },
  ...common,
}));

// define dark theme colors
export const darkTheme: Theme = createTheme(adaptV4Theme({
  palette: {
      mode: "dark",
      common: {
        white: '#FFFFFF',
        black: '#000000'
      },
      primary: { main: '#354653' },
      secondary: { main: '#3B4F55' },
      success: {
        main : "#bac778",
      },
  },
  ...common
}));