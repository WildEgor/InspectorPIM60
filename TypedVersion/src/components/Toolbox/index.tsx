import React, { useState } from "react";
import ToolSlider from "../ToolSlider";
import PaperContainer from "../PaperContainer";
import LoaderContainer from "../molecules/LoaderContainer";
import InspectorService, { EActions, ECommands, EOverlay, EImageSize, TCamMode } from "../../core/services/inspector.service";
import { handlePromise } from "../../core/utils/http-utils";

// import StyledImage from "../atoms/StyledImage";
// import StyledBadge from "../atoms/StyledBadge";
interface Props {
    isRunning?: boolean
    ip?: string
    referenceID: number
}

export default function Toolbox(props: Props) {
    const { 
        // isRunning = true
        ip,
        referenceID
    } = props;

    const Inspector = InspectorService.getInstance(ip || 'localhost');

    const [availableTools, setAvailableTools] = useState<string[]>([])
    const [tabsTool, setTabsTool] = useState<Set<unknown>>()

    const getData = async () => {
        const [errorTools, responseTools] = await handlePromise(Inspector.getTools(referenceID));

        if (!errorTools && responseTools) {
            console.log('[TolBox] Respons tools: ', responseTools)
            // TODO: GET array like ['PIXEL_toolnameblabla_ID', 'EDGE_COUNTER_blabla_ID'...] how to render Slider tool or Radio tool or Check button ???
            /*
                1 OBJ_LOC
                2 PIXEL
                3 EDGE_PIXEL
                4 PATTERN
                5 BLOB
                6 POLYGON
                7 EDGE_LOC
                8 CIRCLE_LOC
                9 DISTANCE
                10 ANGLE
                12 EDGE_COUNTER

                ToolSlider
                ToolRadio
                ToolCheckButton 
            */
            // const validTools = responseTools.map((tool, id) => {
            //     if (tool.startsWith('PIXEL')) {
            //         return <div>
            //             <ToolSlider
            //                 range={ECommands.PIXEL_INTENSITY_THRESHOLD}
            //             />
            //         </div>
            //     }
            // })
            // setAvailableTools(['OBJ_LOC', ...responseTools])
        }
    }


    return(
        <LoaderContainer updateData={getData}>

        </LoaderContainer>
    );
}