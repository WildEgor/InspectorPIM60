import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Skeleton from '@material-ui/lab/Skeleton';
import { StyledTextField, StyledButton, StyledSlider } from 'Style/components';
import { useForm, Controller } from "react-hook-form";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PlaygroundPage(props) {
  const { onUpdateData, onSubmit, onReset, formName, uid, defaultValues, onLoading, onError } = props
  const { handleSubmit, register, setValue, reset, control } = useForm();
  
  const classes = useStyles();

  useEffect(() => {
    switch(true){
      case formName.startsWith('object_locator'):
        setValue(`ObjectLocator_${uid}_MatchThreshold`, defaultValues[0])
        reset({[`ObjectLocator_${uid}_MatchThreshold`]: defaultValues[0]})
        break;
      case formName.startsWith('pixel_counter'):
        reset({
          [`PixelCounter_${uid}_IntensityRange`]: [defaultValues[0][0], defaultValues[0][1]],
          [`PixelCounter_${uid}_NORange`]: [defaultValues[1][0], defaultValues[1][1]],
        })
        break;
    }
  }, [])

  // useEffect(() => {

  // }, [...onUpdateData])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        
        <form className={classes.form} noValidate onSubmit={handleSubmit(async (data) => {
          onSubmit(data)
        })}>
        {
          formName.startsWith('object_locator') &&
          <>
            <Typography component="h1" variant="h5">
              Object Locator {uid}
            </Typography>
            <Typography gutterBottom>Settings 1</Typography>
            <Controller
              name={`ObjectLocator_${uid}_MatchThreshold`}
              control={control}
              defaultValue={defaultValues[0]}
              render={(props) => (
                <StyledTextField
                    id={formName}
                    fullWidth
                    label="ObjectLocator_value 1"
                    autoFocus
                    required
                    name={`ObjectLocator_${uid}_MatchThreshold`}
                    type="number"
                    inputRef={register}
                    variant="filled"
                    InputProps={{ inputProps: { min: defaultValues[1], max: defaultValues[2] } }}
                />
              )}
            /> 
          </> 
          } 
          {
            formName.startsWith('pixel_counter') &&
            <>
            <Typography component="h1" variant="h5">
              Pixel Counter {uid}
            </Typography>
            <Typography gutterBottom>Settings 1</Typography>
            <Controller
              name={`${formName}_${uid}_IntensityRange`}
              control={control}
              defaultValue={[defaultValues[0][0], defaultValues[0][1]]}
              render={(props) => (
                <StyledSlider
                  valueLabelDisplay="on"
                  {...props}
                  onChange={(_, value) => {
                      props.onChange(value);
                  }}
                  max={defaultValues[0][2]}
                  step={defaultValues[0][3]}
                />
              )}
            />
            <Typography gutterBottom>Settings 2</Typography>
            <Controller
              name={`${formName}_${uid}_NORange`}
              control={control}
              defaultValue={[defaultValues[1][0], defaultValues[1][1]]}
              render={(props) => (
                <StyledSlider
                  valueLabelDisplay="on"
                  {...props}
                  onChange={(_, value) => {
                      props.onChange(value);
                  }}
                  max={defaultValues[1][2]}
                  step={defaultValues[1][3]}
                />
              )}
            />
            </>
          }          
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Применить
          </StyledButton>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>  */}
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}
