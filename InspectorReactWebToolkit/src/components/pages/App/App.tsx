import React from "react";
import { observer } from 'mobx-react-lite'

const App = observer(() => {
  return (
    <>
      <div>
            <a href="logger.html" id="supervision" title="Check the status of the camera">Logger</a>
            <a href="liveviewer.html" id="maintenance" title="Device control for field exchange">Live</a>
            <a href="changereference.html" id="batchchange" title="Switch reference object and fine-tune parameters">Change Reference</a>
        </div>
    </>
  )
})

export default App;