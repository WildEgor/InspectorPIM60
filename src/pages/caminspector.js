import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './template/template';
import CamInspectorPage from 'Components/views/CamInspectorPage';
import CamLoggerPage from 'Components/views/CamLoggerPage';
import MenuBar from 'Components/MenuBar';
import camMenuItems from 'Components/MenuBar/camMenuItems';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useStyles } from 'Style/components';
import CamTabs from 'Components/CamTabs';

const CamInspectorView = () => {
    const classes = useStyles()

    const links = [
        {
            name: 'Инспектор',
            component: [<div><CamInspectorPage/></div>]
        },
        {
            name: 'Логгер',
            component: [<div><CamLoggerPage/></div>]
        },
    ]

    return (
        <AppWrapper>
            {/* <Router>
                <MenuBar menuItems={camMenuItems}/>
                <Switch>
                    <Route path={"/caminspector.html/cam_viewer"} render={() => <CamInspectorPage/>}/>
                    <Route path={"/caminspector.html/cam_logger"} render={() => <div><div className={classes.hideContainer}><CamInspectorPage/></div><CamLoggerPage/></div>}/>
                    <Redirect to="/caminspector.html/cam_viewer" />
                </Switch>
            </Router> */}
            <CamTabs links={links} disabled={false}/>
        </AppWrapper>
    )
}

ReactDOM.render(<CamInspectorView />, document.getElementById('root'));