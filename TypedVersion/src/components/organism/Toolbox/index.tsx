import React, { useState } from "react";
import ToolSlider from "../../molecules/ToolSlider";
import ToolCheckBox from "../../molecules/ToolCheckBox";
import ToolRadioButton from "../../molecules/ToolRadioButton";
import LoaderContainer from "../../molecules/LoaderContainer";
import { ECommands, TWidget } from "../../../core/services/inspector/inspector.interface";
import Tabs from "../../molecules/Tabs";

interface Props {
    defaultSettings: TWidget[];
    getInt: (id: number, args?: number[]) => Promise<string[]>;
    setInt: (id: number, args?: number[]) => Promise<boolean>;
    getTools: (id: number) => Promise<string[]>;
}

export default function Toolbox(props: Props) {
    const { 
        defaultSettings,
        getInt, 
        setInt,
        getTools
    } = props;

    const [availableTools, setAvailableTools] = useState<string[]>(['PIXEL_toolnameblabla_ID', 'EDGECOUNTER_blabla_ID', 'BLOB_bllssd_ID'])

    const getData = async () => {
        // await new Promise(resolve => setTimeout(resolve, 5000));

        /*
            Because of a bug in the web API the name and image of reference objects can become out of sync 
            when objects are added or removed from the list of reference objects in SOPAS. It is therefore 
            recommended to have an incrementally ordered list without any jumps or missing numbers. 
            Unfortunatly there is no easy way of sorting the images, but with copy and remove commands 
            it is possible with some extra effort.
        */

        const responseCurrentObject = await getInt(ECommands.REF_OBJ, []);

        if (responseCurrentObject) {
            const responseTools = await getTools(Number(responseCurrentObject[0]));
            if (responseTools) setAvailableTools(responseTools)
        }
    }

    return(
        <LoaderContainer updateData={getData}>
            {availableTools && availableTools.map((tool, id) => {
                const tools = Object.keys(ECommands).filter(key => (!isNaN(Number(ECommands[key])) && tool.includes(key.split('_')[0])));
                if (tools.length) {
                    return (
                        <div>
                            {
                            tools.map(tool => {
                                console.log(defaultSettings[ECommands[tool]], tool)
                                if (defaultSettings[ECommands[tool]]?.type == 'slider'){
                                    return (
                                        // <div><p>{`SLIDER ${tool}`}</p></div>
                                        <ToolSlider
                                            key={tool + id} 
                                            toolName={defaultSettings[ECommands[tool]].toolName}
                                            commandID={ECommands[tool]}
                                            toolID={id}
                                            range={defaultSettings[ECommands[tool]].range}
                                            min={defaultSettings[ECommands[tool]].min}
                                            max={defaultSettings[ECommands[tool]].max}
                                            multiplier={defaultSettings[ECommands[tool]].multiplier}
                                            unit={defaultSettings[ECommands[tool]].unit}
                                            dynamic={defaultSettings[ECommands[tool]].dynamic}
                                            getValue={(id, args) => getInt(id, args)}
                                            setValue={(id, args) => setInt(id, args)}
                                            getDynamic={(args) => getInt(ECommands.ADDT_GETROISIZE, args)}
                                        />
                                    )
                                } else if (defaultSettings[ECommands[tool]]?.type == 'check') {
                                    return (
                                        // <div><p>{`CHECK ${tool}`}</p></div>
                                        <ToolCheckBox
                                            key={tool + id} 
                                            toolName={defaultSettings[ECommands[tool]].toolName}
                                            commandID={ECommands[tool]}
                                            toolID={id}
                                            getValue={(id, args) => getInt(id, args)}
                                            setValue={(id, args) => setInt(id, args)}
                                        />
                                    )
                                } else if (defaultSettings[ECommands[tool]]?.type === 'radio') {
                                    return (
                                        // <div><p>{`Radio ${tool}`}</p></div>
                                        <ToolRadioButton
                                            key={tool + id} 
                                            labels={defaultSettings[ECommands[tool]].labels}
                                            toolName={defaultSettings[ECommands[tool]].toolName}
                                            commandID={ECommands[tool]}
                                            toolID={id}
                                            getValue={(id, args) => getInt(id, args)}
                                            setValue={(id, args) => setInt(id, args)}
                                        />
                                    )
                                }
                            }
                            )
                            }
                        </div>
                    )
                }
                return <div key={tool}></div>
            })}
            <Tabs
                components={[{ name: 'Component1', component: <div><p>Component1</p></div>}, { name: 'Component1', component: <div><p>Component1</p></div>}]}
            />
        </LoaderContainer>
    );
}