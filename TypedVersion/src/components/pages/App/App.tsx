import React from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance("192.168.99.9");

  return (
    <>
    </>
  )
})

export default App;