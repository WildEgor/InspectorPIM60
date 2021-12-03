import React from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";

import { inspectorDevices } from "../../../core/config/api.config";
import LiveViewer from "Src/components/organism/LiveViewer";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  InspectorService.addDevicesIP([...inspectorDevices.map(cam => cam.ip)]);

  const InspectorOne = InspectorService.getDevice(inspectorDevices[0].ip);
  // const InspectorTwo = InspectorService.getDevice(inspectorDevices[1].ip);

  return (
    <>
      <LiveViewer
        width={640}
        height={370}
        getImageStatistic={InspectorOne.getLiveStatistic}
        getImage={InspectorOne.getLiveImage}
      />
    </>
  )
})

export default App;