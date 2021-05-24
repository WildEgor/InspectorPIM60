import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './template/template';
import CamInspectorPage from 'Components/views/CamInspectorPage';
import CamLoggerPage from 'Components/views/CamLoggerPage';
import CamTabs from 'Components/CamTabs';

const CamInspectorView = () => {
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
            <CamTabs links={links} disabled={false}/>
        </AppWrapper>
    )
}

ReactDOM.render(<CamInspectorView />, document.getElementById('root'));