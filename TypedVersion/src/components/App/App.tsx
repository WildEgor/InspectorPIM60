import React, { useState } from "react";
import InspectorService, { EActions, ECommands, EOverlay, EImageSize } from "../../core/services/inspector.service";
import { observer } from 'mobx-react-lite'
import Slider from "../Slider";
import Mode from "../Mode";
import ToggleControl from "../ToggleControl";
import Box from '@material-ui/core/Box';
import CheckBox from "../CheckBox";
import ImageBox from "../ImageBox";
import ActionButton from "../ActionButton";
import LogImageList from "../organism/LogImageList";

import { StyledButton } from "../../style/components";

const App = observer(() => {
  const [isRun, setIsRun] = useState<boolean>(false);

  return (
    <Box>
      {/* <Slider
        Inspector={InspectorService.getInstance("192.168.99.9")}
        //toolName='Angle offset'
        id={ECommands.DISTANCE_OFFSET}
        tool={0}
        // min={10}
        // max={100}
        // step={1}
        // range={false}
      />
      <Mode
        Inspector={InspectorService.getInstance("192.168.99.9")}
      />
      <ToggleControl
        Inspector={InspectorService.getInstance("192.168.99.9")}
        id={ECommands.EDGE_LOC_LINE_FIT_CRITERIA}
      />
      <CheckBox
        tool={0}
        id={ECommands.OBJ_LOC_ROTATION_MODE}
        Inspector={InspectorService.getInstance("192.168.99.9")}
      /> */}
      {/* <Box>
        <ImageBox
          getImage={() => {
            return InspectorService.getInstance('192.168.99.9').getLiveImage(Date.now(), EImageSize.ORIG, EOverlay.SHOW)
          }}
          refreshTime={500}
          isAutoUpdate={isRun}
        />
        <StyledButton onClick={(e) => setIsRun(!isRun)} >Stop</StyledButton>
      </Box> */}
      {/* <ActionButton
        Inspector={InspectorService.getInstance("192.168.99.9")}
        id={EActions.RETEACH_REF_OBJ}
      /> */}
      <LogImageList
        lockLogger={(lock) => InspectorService.getInstance("192.168.99.9").setLogState(lock)}
        getImage={(id) => InspectorService.getInstance("192.168.99.9").getLogImage(id, EImageSize.ORIG, EOverlay.SHOW)}
        range='5-30'
      />
    </Box>
  )
})

export default App;