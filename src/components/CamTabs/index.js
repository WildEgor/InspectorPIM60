import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';

import FormControl from '@material-ui/core/FormControl';
import {StyledSelector} from 'Style/components';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '640px',
    position: 'relative',
    minHeight: 100,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  swipeableViews: {
    backgroundColor: theme.palette.secondary.dark,
  },
  box: {
    padding: '0px'
  },
  tab: {
    root: {
      backgroundColor: theme.palette.secondary.main,
    }
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
}));

function TabPanel(props) {
  const classes = useStyles()

  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes.box} p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

export default function CamTabs(props) {
    const [componentNumber, setComponentNumber] = React.useState(1)

    const {links, disabled} = props
    const classes = useStyles();
    const theme = useTheme();
    const [tabValue, setTabValue] = React.useState(0);

    React.useEffect(() => {
        console.log('Links', links)
    }, [links])

    const handleChange = (event, newValue) => {
      if (!disabled)
        setTabValue(newValue);
    };

    const handleChangeIndex = (index) => {
      if (!disabled)
        setTabValue(index);
    };

    React.useEffect(() => {

    }, [componentNumber])

    return (
      <div className={classes.root}>
        <AppBar position="static" color="secondary">
            <Tabs
              value={tabValue}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              aria-label="action tabs example"
            >
                {links.map((link, i) => <Tab disabled={link.isDisabled ?? false} key={`tab${i}`} label={link.name} {...a11yProps(0)} />)}
            </Tabs>
        </AppBar>
        <SwipeableViews
          className={classes.swipeableViews}
          slideStyle={{'overflowX': 'hidden', }}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
        >
            {links.map((link, i) => 
                <TabPanel key={`tabpanel${i}`} value={i} index={i} dir={theme.direction}>
                {
                    <>
                    {
                        (link.component.length > 1)? 
                        <>
                        <FormControl className={classes.margin}>
                            <StyledSelector
                                labelId={`change-active-instrument`}
                                id={`change-active-instrument`}
                                value={componentNumber}
                                onChange={(e) => {
                                        setComponentNumber(e.target.value);
                                        console.log(e.target.value)
                                    }
                                }
                            >
                                {links[tabValue].component.map((item, i) => <MenuItem key={`MenuItem_${i}`} value={i + 1}>Инструмент №{i + 1}</MenuItem>)}
                            </StyledSelector>
                        </FormControl>
                            {link.component[componentNumber - 1]}
                        </>
                        :
                        <>
                            {link.component[0]}
                        </>
                    }
                    </>
                }
                </TabPanel>
            )}
        </SwipeableViews>
      </div>
    );
}
