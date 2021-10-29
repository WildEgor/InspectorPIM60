import React from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";

import { serverURI } from "../../../core/config/api.config";
import ImageBox from "../../molecules/ImageBox";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance(serverURI);

  return (
    <>
      <ImageBox
        getImage={Inspector.getLiveImage}
      />
    </>
  )
})

export default App;