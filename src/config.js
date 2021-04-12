const config = {
     BASE_URL: process.env.NODE_ENV === 'production'? window.location : 'http://192.168.99.9',
     // BASE_URL: process.env.NODE_ENV === 'production'? 'http://192.168.99.9' : 'http://192.168.99.9',
     CAMLIVEVIEWER: {
          updateTime: 150
     },
     CAMLOGGER: {
          countLogImages: 30,
          updateTime: 5000,
     },
     CAMREFERENCE: {}
};

export default config

//rimraf node_modules