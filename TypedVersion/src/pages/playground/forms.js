import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from '../template/template';
import PlaygroundPage from 'Components/views/PlaygroundPage';

const PlaygroundView = () => {
    return (
        <AppWrapper>
            <PlaygroundPage 
                formName="pixel_counter" 
                defaultValues={[[0, 200, 255, 1], [10, 200, 342, 5]]} 
                uid={0} 
                onSubmit={(data) => console.log(data)}
            />
            <PlaygroundPage 
                formName="object_locator" 
                defaultValues={[234, 10, 255]} 
                uid={0}
                onSubmit={(data) => console.log(data)}
            />
        </AppWrapper>
    )
}

// ReactDOM.render(<PlaygroundView />, document.getElementById('root'));