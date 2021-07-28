import React, { useState } from "react";
import ToolSlider from "../../molecules/ToolSlider";
import ToolCheckBox from "../../molecules/ToolCheckBox";
import ToolRadioButton from "../../molecules/ToolRadioButton";
import LoaderContainer from "../../molecules/LoaderContainer";
import { ECommands, TWidget } from "../../../core/services/inspector/inspector.interface";
import Tabs from "../../molecules/Tabs";
import { Typography } from "@material-ui/core";
import PaperContainer from "../../molecules/PaperContainer";

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

    const [toolTabs, setToolTabs] = useState([])
    const [pending, setPending] = useState<boolean>(false);

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
        const responseTools = await getTools(Number(responseCurrentObject[0]));

        if (responseTools){
            setToolTabs(responseTools.map((tool, id) => {
                const tools = Object.keys(ECommands).filter(key => (!isNaN(Number(ECommands[key])) && tool.includes(key.split('_')[0])));
                if (tools.length) {
                    return (
                        { name: tool,
                        component: <div>
                        {
                        tools.map(tool => {
                            if (defaultSettings[ECommands[tool]]?.type == 'slider'){
                                return (
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
                        }
                    )
                } else {
                    throw new Error('No tools')
                }
            }))
        }
    }

    return(
        <PaperContainer width={640}>
            <Typography variant='h5'>Toolbox</Typography>
            <LoaderContainer updateData={getData} isPending={setPending}>
                <Tabs
                    lazyLoad={pending}
                    components={toolTabs}
                />
            </LoaderContainer>
        </PaperContainer>
    );
}