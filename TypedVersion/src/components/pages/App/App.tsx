import React from "react";
import { observer } from 'mobx-react-lite'
import Box from '@material-ui/core/Box';
import Toolbox from "../../organism/Toolbox";

import InspectorService from "../../../core/services/inspector.service";

import { handlePromise } from "../../../core/utils/http-utils";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance("192.168.99.9");

  return (
    <Box>
      <Toolbox
        defaultSettings={Inspector.defaultSettings}
        getInt={(id, args) => handlePromise(Inspector.getInt(id, args))}
        setInt={(id, args) => handlePromise(Inspector.setInt(id, args))}
        getTools={(id) => handlePromise(Inspector.getTools(id))}
      />
    </Box>
  )
})

export default App;