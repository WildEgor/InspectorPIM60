import React from 'react'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { StyledToggleButton } from 'Style/components';

const SelectOverlay = (props) => {
    const {onChange, value, disabled} = props
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={onChange}
        >
            <StyledToggleButton disabled={disabled} value="ShowOverlay" aria-label="centered">
                <h6>Полностью</h6>
            </StyledToggleButton>
            <StyledToggleButton disabled={disabled} value="SimplifiedOverlay" aria-label="centered">
                <h6>Минимально</h6>
            </StyledToggleButton>
            <StyledToggleButton disabled={disabled} value="" aria-label="centered">
                <h6>Скрыть</h6>
            </StyledToggleButton>
        </ToggleButtonGroup>
    )
}

export default SelectOverlay