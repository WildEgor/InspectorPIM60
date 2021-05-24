import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { NavLink, withRouter } from 'react-router-dom';

import Menu, {
  Button, 
  Dropdown,  
  DropdownItem, 
} from "@kenshooui/react-menu";

import { StyledButton, useStyles } from 'Style/components';

//import menuItems from './menuItems';

const MenuBar = (props) => {
  const classes = useStyles()
  const { menuItems, isDisabled } = props

  const nextPath = (path) => {
    props.history.push(path);
  }

  const handler = ( children, event ) => {
    return children.map( ( subOption ) => {
      if ( !subOption.children ) {
        if (event == 'this') {
        return (
            <DropdownItem key={uuidv4()} className='drop-down__item'>
                <StyledButton key= {uuidv4()} onClick={() => nextPath(subOption.url) }>
                    <NavLink key={uuidv4()} to={ subOption.url }>{subOption.name}</NavLink>
                </StyledButton>
            </DropdownItem>
          )
        } else {
          return(
            <Button 
              key= {uuidv4()}
              className='drop-down__button'
              disabledClassName='drop-down__button--disabled'
              onClick={() => nextPath(subOption.url)}
              isDisabled={isDisabled}
            >
              <NavLink key={uuidv4()} to={subOption.url }>{subOption.name}</NavLink>
            </Button>
          )
         }
      }
      return (
        <Dropdown
            key={uuidv4()} 
            className='drop-down'
            disabledClassName='drop-down--disabled'
            itemsClassName='drop-down__items'
            iconClassName='drop-down__icon'
            label={subOption.name}
            // children={
            //     <StyledButton>
            //         <NavLink to='/camreference.html/object_locator'>object_locator</NavLink>
            //     </StyledButton>
            // }
            withIcon={false}
            //onClick={() => this.handleClick( subOption.name )}
            direction='bottom'
            isDisabled={isDisabled}
        >
            { handler( subOption.children, 'this' ) }
        </Dropdown>
      )
    } )
  }

  return (
    <Menu 
      key={uuidv4()}
      className={classes.refNavbar} 
      // children={''}
    >
      { handler( menuItems.data, 'own') }
    </Menu>
  )
}

export default withRouter(MenuBar)