import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './template/template';
import CamReferencePage from 'Components/views/CamReferencePage';

const CamReferenceView = () => {
    return (
        <AppWrapper>
            <CamReferencePage/>
        </AppWrapper>
    )
}

ReactDOM.render(<CamReferenceView />, document.getElementById('root'));