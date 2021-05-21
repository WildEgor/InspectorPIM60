import { createStore, persist } from 'easy-peasy';
import liveImagesModel from './live-images-model';
import logImagesModel from './log-images-model';
import referenceImagesModel from './reference-images-model';
import commonCommandsModel from './common-commands-model';
import NotifierModel from './notifier-model';

const model = {
  liveImages: liveImagesModel,
  logImages: logImagesModel,
  referenceImages: referenceImagesModel,
  commonCommands: commonCommandsModel,
  notifyController: NotifierModel
};

const store = createStore(model
  // persist(model,
  //   {
  //     //allow: ['referenceImages', 'logImages', 'liveImages', 'commonCommands'],
  //     //storage: 'localStorage',
  //     //mergeStrategy: 'mergeDeep'
  //   },
  // ),
);

// Wrapping dev only code like this normally gets stripped out by bundlers
// such as Webpack when creating a production build.
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept(model, () => {
      store.reconfigure(model);
    });
  }
}

export const refreshPage = async () => {
  // Firstly ensure that any outstanding persist operations are complete.
  // Note that this is an asynchronous operation so we will await on it.
  await store.persist.flush();

  // we can now safely reload the page
  //window.document.reload();
};

export const deleteStoreData = async () => {
  await store.persist.clear()
}

export default store;