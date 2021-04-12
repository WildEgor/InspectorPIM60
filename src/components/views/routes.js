import React from 'react';
import { Switch, Route } from 'react-router-dom';

export default function useRoutes(props) {

    return (
        <Switch>
            {
            props? props.map(route => {
                return (
                    <Route path={"/" + route.url} component={() => route.component} exact/>
                )
            })
            : <h1>Error</h1>
            }
        </Switch> 
        );
};