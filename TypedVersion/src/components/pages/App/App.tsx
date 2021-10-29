import React from "react";
import { observer } from 'mobx-react-lite'
import InspectorService from "../../../core/services/inspector/inspector.service";
import ReferenceImageBox from "../../organism/ReferenceImageBox";

import { serverURI } from "../../../core/config/api.config";
import LogImageList from "../../organism/LogImageList";
import ImageBox from "../../molecules/ImageBox";
import Toolbox from "../../organism/Toolbox";
import MonitorData from "../../molecules/MonitorData";

const App = observer(() => {
  //const { notificationStore } = useContext(StoreContext);

  const Inspector = InspectorService.getInstance(serverURI);

  return (
    <>
    {/* <LogImageList
      range={[0, 30]}
      getImage={(id) => Inspector.getLogImage(id)}
      lockLogger={(lock) => Inspector.setLogState(lock)}
    /> */}
    <ImageBox
      getImage={Inspector.getLiveImage}
    />
    {/* <ReferenceImageBox
      width={480}
      height={320}
      getMode={Inspector.getMode}
      setMode={Inspector.setMode}
      getRecipeImage={Inspector.getReferenceObject}
      getActiveRecipeImage={Inspector.getActiveRecipe}
      getRecipesNames={Inspector.getRecipeNames}
      updateRecipe={Inspector.updateRecipe}
      getActiveRecipeNumber={Inspector.getActiveReferenceIndex}
      getRecipes={Inspector.getRecipeCount}
    /> */}
    {/* <Toolbox
      defaultSettings={Inspector.defaultSettings}
      getInt={Inspector.getInt}
      setInt={Inspector.setInt}
      getTools={Inspector.getTools}
    />   */}
    </>
  )
})

export default App;