import React from 'react';
import { ECommands, TWidget, TInspectorService } from "../../core/services/inspector.service";

interface Props {
    id: number,
    multiplier?: number,
    updateRate?: 1 | 5 | 10,
    showName?: boolean,
    Inspector: TInspectorService
}

const MonitorData = (props: Props) => {
    return(
        <div></div>
    )
}

export default MonitorData;
