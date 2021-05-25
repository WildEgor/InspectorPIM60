import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface HelloWorldProps {
  [propName: string]: any;
}

export const TypedApp = (): JSX.Element => <h1>Hi from React</h1>;

ReactDOM.render(<TypedApp />, document.getElementById('root'));
