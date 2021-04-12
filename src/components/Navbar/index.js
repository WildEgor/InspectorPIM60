import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

import Menu, {
    Button, 
    Dropdown, 
    Separator, 
    DropdownItem, 
} from "@kenshooui/react-menu";

import {
    useStyles, 
    BorderLinearProgress, 
    StyledViewerImage, 
    StyledButton, 
    StyledToggleButton, 
    StyledSelector, 
    StyledTextField
} from '../../style/components';

const Navbar = (props) => {
    const { links } = props
    const classes = useStyles();
    const tools = ["object_locator", "pixel_counter", "edge_counter", "pattern"]

    return(
        <Menu className={classes.refNavbar} children={''}>
            <Dropdown 
                classesName='drop-down'
                disabledClassName='drop-down--disabled'
                itemsClassName='items'
                iconClassName='icon'
                label="Object Locator"
                // children={
                //     <StyledButton>
                //         <NavLink to='/camreference.html/object_locator'>object_locator</NavLink>
                //     </StyledButton>
                // }
                isDisabled
                withIcon={false}
                onClick={() => {}}
                direction='bottom'
            >
                <DropdownItem className='item'>
                    <StyledButton>
                        <NavLink to='/camreference.html/object_locator'>object_locator</NavLink>
                    </StyledButton>
                </DropdownItem>
            </Dropdown>
            <Dropdown label="Pixel Counters">
                <DropdownItem><StyledButton><NavLink to='/camreference.html/pixel_counter_1'>pixel_counter_1</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/pixel_counter_2'>pixel_counter_2</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/pixel_counter_3'>pixel_counter_3</NavLink></StyledButton></DropdownItem>
            </Dropdown>
            <Dropdown label="Edge Counters">
                <DropdownItem><StyledButton><NavLink to='/camreference.html/edge_counter_1'>edge_counter_1</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/edge_counter_2'>edge_counter_2</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/edge_counter_3'>edge_counter_3</NavLink></StyledButton></DropdownItem>
            </Dropdown>
            <Dropdown label="Paterns">
                <DropdownItem><StyledButton><NavLink to='/camreference.html/paterns_1'>paterns_1</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/paterns_2'>paterns_2</NavLink></StyledButton></DropdownItem>
                <DropdownItem><StyledButton><NavLink to='/camreference.html/paterns_3'>paterns_3</NavLink></StyledButton></DropdownItem>
            </Dropdown>
        </Menu>
    )
}

export default Navbar