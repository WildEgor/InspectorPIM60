import React, {useEffect, useState} from 'react'
import CamReferenceViewer from 'Components/CamReferenceViewer';
import { useStoreActions, useStoreRehydrated  } from 'easy-peasy';
import Spinner from 'Components/Spinner';
//import {Promise as BBPromise} from 'bluebird';

function CamReferencePage (){ 
    //let isRehydrated = useStoreRehydrated();
    const [isRehydrated, setIsRehydrated] = useState(false)
    const setInitialCommandsStateSettings = useStoreActions(actions => actions.commonCommands.setInitialCommandsState)
    const setInitialCommandsStateViewer = useStoreActions(actions => actions.referenceImages.setInitialCommandsState)

    useEffect(() => {
        //isRehydrated = false
        Promise.all([setInitialCommandsStateViewer(), setInitialCommandsStateSettings()])
        .then(() => {
            //isRehydrated = true
            setIsRehydrated(true)
        })
    }, [])

    return(
        <> 
            {isRehydrated ? <CamReferenceViewer /> : <Spinner/>}
        </>
    )
}

export default CamReferencePage