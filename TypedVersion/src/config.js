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
     CAMREFERENCE: {},
     CAMERRORS: {
          8100: 'Operation is not allowed in current mode',
          8101: 'The reference bank is not used on the device',
          8102: 'Operation is not allowed, for example trying sINT 20 0 when not in calibration mode',
          8103: 'Calibration mode is not enabled when trying to perform calibration or trying to remove non-existent calibration',
          8104: 'No object locator is available in current reference bank',
          8105: 'No blob tool with this index exists',
          8106: 'Polygon defect detection is not enabled',
          8107: 'No polygon with supplied index exists',
          8108: 'No pixel counter with supplied index exists',
          8109: 'No edge pixel counter with supplied index exists',
          8110: 'No pattern inspection with supplied index exists',
          8111: 'The move or rotation caused the ROI to appear outside of the FOV',
          8112: 'Trig is not activated',
          8113: 'The specified IP address was invalid, or an invalid combination of addresses was used. The specified network mask was invalid. The specified gateway address was invalid. The combination of IP settings was invalid',
          8114: 'Calibration failed',
          8115: 'Interface not available. Only interfaces that exist in the product can be enabled/disabled',
          8116: 'No edge tool with supplied index exists',
          8117: 'No angle tool with supplied index exists',
          8118: 'No circle with supplied index exists',
          8119: 'No distance tool with supplied index exists',
          8120: 'The specified tool does not have a region (it is a measurement)',
          8121: 'The tool type of the specified tool does not support this command',
          8122: 'No tool with supplied index exists',
          8123: 'No edge count tool with supplied index exists',
          8124: 'Search region is not enabled',
          8125: 'Width or height is invalid',
          8126: 'No tools in configuration',
          8127: 'Invalid unit specified',
          8128: 'Alignment to specified control points failed'
     }
};

export default config