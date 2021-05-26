import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {inspectorService} from '../../../core/services/'

export interface HelloWorldProps {
  [propName: string]: any;
}

export const TypedApp = (): JSX.Element => {
  React.useEffect(() => {
    inspectorService.default(1, 0, 'ShowOverlay')
  }, [])

return (
<h1>Hi from React</h1>
)}

ReactDOM.render(<TypedApp />, document.getElementById('root'));
