import React, { 
  // useContext, 
  // useEffect 
} from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "Src/core/services/inspector/inspector.service";
import { toast } from 'react-toastify';
import { inspectorDevices } from "Src/core/config/api.config";
import LogImageList from "Components/organism/LogImageList";
import { Toaster } from "Src/style/toast";
// import { StoreContext } from "../../../core/store/rootStore";
// import { ENotification } from "../../../core/store/notificationsStore/notificationsTypes";

const App = observer(() => {
  // const { notificationStore } = useContext(StoreContext);

  InspectorService.addDevicesIP([...inspectorDevices.map(cam => cam.ip)]);

  const InspectorOne = InspectorService.getDevice(inspectorDevices[0].ip);
  const InspectorTwo = InspectorService.getDevice(inspectorDevices[1].ip);
  
  // useEffect(() => {
  //   notificationStore.setNotification({
  //     message: "HELLO WORLD",
  //     variant: ENotification.SUCCESS, 
  //   })
  // }, [])

  return (
    <>
      <LogImageList
        // isError={(error) => notificationStore.setNotification({
        //   message: error,
        //   variant: ENotification.ALERT, 
        // })}
        isError={(error: string) => Toaster.error(error)}
        range={[0, 30]}
        getImage={(id) => InspectorOne.getLogImage(id)}
        lockLogger={(lock) => InspectorOne.setLogState(lock)}
      />
      <LogImageList
        // isError={(error) => notificationStore.setNotification({
        //   message: error,
        //   variant: ENotification.ALERT, 
        // })}
        isError={(error: string) => toast.error(error, {
          position: "top-left",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })}
        range={[0, 30]}
        getImage={(id) => InspectorTwo.getLogImage(id)}
        lockLogger={(lock) => InspectorTwo.setLogState(lock)}
      />
    </>
  )
})

export default App;