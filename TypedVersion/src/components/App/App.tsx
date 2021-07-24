import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../core/store/rootStore";
import InspectorService, { EActions, ECommands, EOverlay, EImageSize, TCamMode } from "../../core/services/inspector.service";
import { observer } from 'mobx-react-lite'
import ToolSlider from "../ToolSlider";
import Mode from "../Mode";
import ToggleControl from "../ToggleControl";
import Box from '@material-ui/core/Box';
import CheckBox from "../CheckBox";
import ImageBox from "../molecules/ImageBox";
import ActionButton from "../ActionButton";
import LogImageList from "../organism/LogImageList";

import StyledButton from "../atoms/StyledButton";

import { handlePromise } from "../../core/utils/http-utils";

const App = observer(() => {
  const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance("192.168.99.9");

  return (
    <Box>
      <ToolSlider
        toolName={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].toolName}
        commandID={ECommands.DISTANCE_OFFSET}
        toolID={0}
        range={Inspector.defaultSettings[ECommands.CIRCLE_LOC_ROBUSTNESS].range}
        min={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].min}
        max={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].max}
        multiplier={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].multiplier}
        unit={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].unit}
        dynamic={Inspector.defaultSettings[ECommands.DISTANCE_OFFSET].dynamic}
        getValue={(id, args) => handlePromise(Inspector.getInt(id, args))}
        setValue={(id, args) => handlePromise(Inspector.setInt(id, args))}
        getDynamic={(args) => handlePromise(Inspector.getInt(ECommands.GET_ROI_SIZE, args))}
      />
      {/* <Mode
        getMode={() => Inspector.getMode()}
        setMode={(mode) => Inspector.setMode(mode as TCamMode)}
      /> */}
      {/* <ToggleControl
        Inspector={InspectorService.getInstance("192.168.99.9")}
        id={ECommands.EDGE_LOC_LINE_FIT_CRITERIA}
      />
      <CheckBox
        tool={0}
        id={ECommands.OBJ_LOC_ROTATION_MODE}
        Inspector={InspectorService.getInstance("192.168.99.9")}
      />  */}
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
      {/* <LogImageList
        lockLogger={(lock) => InspectorService.getInstance("192.168.99.9").setLogState(lock)}
        getImage={(id) => InspectorService.getInstance("192.168.99.9").getLogImage(id, EImageSize.ORIG, EOverlay.SHOW)}
        isError={(error) => {
          notificationStore.setNotification({
            message: error,
            variant: 2,
            timeout: 5000
          })
        }}
        range={[0, 5]}
      /> */}
    </Box>
  )
})

export default App;