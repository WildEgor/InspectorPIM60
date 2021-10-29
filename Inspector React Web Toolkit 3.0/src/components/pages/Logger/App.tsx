import React, { 
  // useContext, 
  // useEffect 
} from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "Src/core/services/inspector/inspector.service";
import { toast } from 'react-toastify';
import { serverURI } from "Src/core/config/api.config";
import LogImageList from "Components/organism/LogImageList";
// import { StoreContext } from "../../../core/store/rootStore";
// import { ENotification } from "../../../core/store/notificationsStore/notificationsTypes";

import 'react-toastify/dist/ReactToastify.css';

const App = observer(() => {
  // const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance(serverURI);
  
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
      isError={(error: string) => toast.error(error, {
        position: "top-left",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })}
      range={[0, 30]}
      getImage={(id) => Inspector.getLogImage(id)}
      lockLogger={(lock) => Inspector.setLogState(lock)}
    />
    </>
  )
})

export default App;