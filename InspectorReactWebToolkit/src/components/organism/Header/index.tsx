import React, { useEffect } from "react";
import { AppBar, Box, FormControlLabel, FormGroup, Grid, Link, SvgIcon, Toolbar, Typography } from "@material-ui/core";
import IconButton from '@mui/material/IconButton';
import StyledButton from "Src/components/atoms/StyledButton";
// import StyledSwitch from "Src/components/atoms/StyledSwitch";
// import { observer } from "mobx-react-lite";

interface HeaderProps {
  isChecked?: (check: boolean) => void;
}

import Icon from "Src/logo-site.svg"

const Header = (props: HeaderProps) => {
  const { isChecked } = props
  const [auth, setAuth] = React.useState(true);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  useEffect(() => {
    isChecked && isChecked(auth);
  }, [auth])

  return (
    <AppBar position="static">
      <Toolbar>
      <Grid container>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={''}
        />
      </FormGroup> */}
      <Grid item xs={2}>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <SvgIcon component="object">
              <embed type="image/svg+xml" src={Icon} style={{ height: "100%" }} />
            </SvgIcon>
          </IconButton>
        </Grid>
      <Grid item xs={10}>
        <Link href='logger.html'>
          <StyledButton
            color='secondary' 
            variant="contained"
          >
            <Typography>LOGGER</Typography>
          </StyledButton>
        </Link>
        <Link href='liveviewer.html'>
          <StyledButton
            color='secondary' 
            variant="contained"
          >
            <Typography>LIVE</Typography>
          </StyledButton>
        </Link>
        <Link href='batchchange.html'>
          <StyledButton
            color='secondary' 
            variant="contained"
          >
            <Typography>MAINTENANCE</Typography>
          </StyledButton>
        </Link>
        </Grid>
          </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header;