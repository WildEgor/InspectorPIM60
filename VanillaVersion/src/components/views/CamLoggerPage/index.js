import React, {useEffect} from 'react'
import CamLogger from 'Components/CamLogger';
import { useStoreActions, useStoreRehydrated  } from 'easy-peasy';
import Spinner from 'Components/Spinner';
function CamLoggerPage (){
    let isRehydrated = useStoreRehydrated();
    const setInitialCommandsState = useStoreActions(actions => actions.logImages.setInitialCommandsState)

    useEffect(() => {
        isRehydrated = false
        setInitialCommandsState().then(() => {
            isRehydrated = true
        })
    }, [])

    return(
        <>
            {isRehydrated? <CamLogger/> : <Spinner/>}
        </>
    )
}

export default CamLoggerPage