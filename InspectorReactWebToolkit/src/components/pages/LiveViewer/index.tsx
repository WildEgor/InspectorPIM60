import React from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";

import { inspectorDevices } from "../../../core/config/api.config";
import LiveViewer from "Src/components/organism/LiveViewer";
import Header from "../Header";
import { Box } from "@material-ui/core";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  InspectorService.addDevicesIP([...inspectorDevices.map(cam => cam.ip)]);

  const InspectorOne = InspectorService.getDevice(inspectorDevices[0].ip);
  // const InspectorTwo = InspectorService.getDevice(inspectorDevices[1].ip);

  return (
    <>
      <LiveViewer
        getImageStatistic={InspectorOne.getLiveStatistic}
        getImage={InspectorOne.getLiveImage}
      />
    </>
  )
})

export default App;