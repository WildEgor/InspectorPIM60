import React, { Fragment } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import useRoutes from '../views/routes'
import Navbar from '../Navbar';

function App() {
    const routes = useRoutes()

    return (
        <Fragment>
            <Router>
                <Navbar show={true}/>
                {routes }
            </Router>
        </Fragment> 
    );
}

export default App;