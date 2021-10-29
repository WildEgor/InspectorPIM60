import React, { useContext, useEffect } from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";
import ReferenceImageBox from "../../organism/ReferenceImageBox";

import { serverURI } from "../../../core/config/api.config";
import LogImageList from "../../organism/LogImageList";
import ImageBox from "../../molecules/ImageBox";
import Toolbox from "../../organism/Toolbox";
import MonitorData from "../../molecules/MonitorData";
import { StoreContext } from "../../../core/store/rootStore";
import { ENotification } from "../../../core/store/notificationsStore/notificationsTypes";

const App = observer(() => {
  const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance(serverURI);
  
  useEffect(() => {
    notificationStore.setNotification({
      message: "HELLO WORLD",
      variant: ENotification.SUCCESS, 
    })
  }, [])

  return (
    <>
    <LogImageList
      range={[0, 30]}
      getImage={(id) => Inspector.getLogImage(id)}
      lockLogger={(lock) => Inspector.setLogState(lock)}
    />
    </>
  )
})

export default App;