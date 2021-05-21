import React, {useEffect} from 'react'
import CamViewer from 'Components/CamViewer';
import { useStoreActions, useStoreRehydrated  } from 'easy-peasy';
import Spinner from 'Components/Spinner';

function CamInspectorPage() {
    let isRehydrated = useStoreRehydrated();
    const setInitialCommandsState = useStoreActions(actions => actions.liveImages.setInitialCommandsState)

    useEffect(() => {
        isRehydrated = false
        setInitialCommandsState().then(() => {
            isRehydrated = true
        })
    }, [])

    return(
        <>
            {isRehydrated? <CamViewer/> : <Spinner/>}
        </>
    )
}

export default CamInspectorPage