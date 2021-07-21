import ipRegex from "ip-regex";
import HttpClient, { ICustomAxiosResponse } from './interface/http';

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

export type TCamMode = Range<0, 2>;

enum EOverlay {
  SHOW = 'ShowOverlay',
  HIDE = 'HideOverlay',
  SIMPLE = 'SimplifiedOverlay'
}

enum EImageSize {
  ORIG = 1,
  SMALL = 2
}

enum EWEbConstants {
  DEFAULT_REFRESH = 700
}

enum EActions {
  /** aACT **/
  SAVE_TO_FLASH = 1,
  RETEACH_REF_OBJ = 2,
  PERFORM_CALIBRATION = 3,
  REMOVE_CALIBRATION = 4,
  APPLY_IP_SETTINGS = 5,
  REBOOT_DEVICE = 6,
  PERFORM_ALIGNMENT = 7,
}

enum EgetString {
  /** gSTR **/
  GET_NAME_DEVICE = 1,
  GET_NAME_REF_OBJ = 2,
  GET_NAME_OBJ_LOC = 3,
  GET_NAME_PIXEL = 4,
  GET_NAME_EDGE_PIXEL = 5,
  GET_NAME_PATTERN = 6,
  GET_NAME_BLOB = 7,
  GET_NAME_POLYGON = 8,
  GET_NAME_EDGE_LOCATOR = 9,
  GET_NAME_CIRCLE_LOCATOR = 10,
  GET_NAME_DISTANCE = 11,
  GET_NAME_ANGLE = 12,
  GET_NAME_ECP = 13,
  GET_NAME_ALL = 14,
  GET_BEAD_TOOL_NAME = 20,
}

enum ECommands {
  /** sINT and gINT identifiers **/
  ILLUM_MODE = 13,
  // Reference Image
  REF_OBJ = 1,
  GET_NO_REF_OBJ = 2,
  // Setting reference image 
  EXPOSURE = 14,
  GAIN = 15,
  TRIG_MODE = 16,
  CALIBRATION_MODE = 20,
  // Object locator
  OBJ_LOC_MATCH_THRESHOLD = 32,
  OBJ_LOC_ROTATION_MODE = 33,
  OBJ_LOC_ROTATION_SEARCH = 34,
  OBJ_LOC_SCALED_SEARCH = 35,
  OBJ_LOC_ROBUSTNESS = 36,
  OBJ_LOC_ACCURACY = 37,
  OBJ_LOC_MOVE_ROTATE = 38,
  // Blob 
  BLOB_INTENSITY_THRESHOLD = 48,
  BLOB_AREA_THRESHOLD = 49,
  BLOB_ANGLE_THRESHOLD = 50,
  BLOB_STRUCTURE_THRESHOLD = 53,
  BLOB_EDGE_STRENGTH = 54,
  BLOB_AMBIENT_LIGHT = 55,
  BLOB_SEARCH_METHOD = 56,
  BLOB_MOVE_ROTATE = 58,
  BLOB_NO_BLOB_THRESHOLD = 59,
  // Polygon
  POLYGON_POSITION_TOLERANCE = 64,
  POLYGON_FLEXIBILITY_TOLERANCE = 65,
  POLYGON_SCORE_THRESHOLD = 66,
  POLYGON_MARGIN = 67,
  POLYGON_DEFECT_DETECTION_WIDTH = 68,
  POLYGON_DEFECT_INTENSITY_THRESHOLD = 69,
  POLYGON_MAX_DEFECTS_THRESHOLD = 70,
  POLYGON_DEFECT_DETECTION_MODE = 71,
  POLYGON_MOVE_ROTATE = 72,
  POLYGON_MOVE_CORNER = 73,
  // Pixel counter
  PIXEL_INTENSITY_THRESHOLD = 80,
  PIXEL_NO_PIXELS_THRESHOLD = 81,
  // Edge pixel counter
  EDGE_PIXEL_EDGE_STRENGTH = 82,
  EDGE_PIXEL_NO_PIXELS_THRESHOLD = 83,
  // Pattern
  PATTERN_POSITION_TOLERANCE = 84,
  PATTERN_SCORE_THRESHOLD = 85,
  // Move and rotate inspections
  INSPECTION_MOVE_ROTATE = 86,
  // Get ROI size
  GET_ROI_SIZE = 87,
  // Device settings p.56
  INTERFACE_PERMISSION = 112,
  IP_ADDRESS = 120,
  NETMASK = 121,
  GATEWAY = 122,
  // Edge locator
  EDGE_LOC_EDGE_CONTRAST = 150,
  EDGE_LOC_LINE_FIT_CRITERIA = 151,
  EDGE_LOC_POLARITY = 152,
  EDGE_LOC_SCORE_THRESHOLD = 153,
  // Circle locator
  CIRCLE_LOC_EDGE_CONTRAST = 160,
  CIRCLE_LOC_DIAMETER_THRESHOLD = 161,
  CIRCLE_LOC_LINE_FIT_CRITERIA = 162,
  CIRCLE_LOC_POLARITY = 163,
  CIRCLE_LOC_ROBUSTNESS = 164,
  CIRCLE_LOC_SCORE_THRESHOLD = 165,
  CIRCLE_LOC_QUALITY = 166,
  CIRCLE_LOC_DIAMETER_OFFSET = 167,
  CIRCLE_LOC_DIAMETER_TOLERANCE_THRESHOLD = 169,
  // Distance
  DISTANCE_THRESHOLD = 170,
  DISTANCE_OFFSET = 173,
  // Angle
  ANGLE_THRESHOLD = 180,
  ANGLE_OFFSET = 181,
  // Edge Counter
  EDGE_COUNTER_EDGE_CONTRAST = 190,
  EDGE_COUNTER_EDGE_QUIALITY = 191,
  EDGE_COUNTER_FEATURE_WIDTH = 192,
  EDGE_COUNTER_FEATURE_TYPE = 193,
}

export type TWidget = {
  type: 'slider' | 'radio' | 'check' | 'button',
  toolName: string,
  defaultValue: number | number[] | boolean | string,
  dynamic?: boolean | 'min' | 'max',
  min?: number,
  max?: number,
  multiplier?: number,
  step?: number,
  labels? : string[],
  range?: boolean | 'max' | 'min',
  unit?: number,
}

/**
 * Main class with request/response ability
 */
class InspectorService extends HttpClient {

  private static _classInstance?: InspectorService;
  private static _devices?: Array<InspectorService> = [];

  private deviceMode: number;

  public defaultSettings: Array<TWidget> = [];
  /**
   * @info Singleton Pattern ???
   * @param ip 
   */
  private constructor(ip: string) {
    super(ip);

    // Image settings
    this.defaultSettings[ECommands.EXPOSURE] = { type: 'slider', toolName: 'Change exposure', defaultValue: 0.1, min: 0.1, max: 100, multiplier: 100 };
    this.defaultSettings[ECommands.GAIN] = { type: 'slider', toolName: 'Change gain', defaultValue: 100, min: 100, max: 400 };
    this.defaultSettings[ECommands.TRIG_MODE] = { type: 'radio', toolName: 'Change trig mode', defaultValue: 'Free-running',  labels: ['Free-running', 'Triggered'] };

    // Object locator
    this.defaultSettings[ECommands.OBJ_LOC_MATCH_THRESHOLD] = { type: 'slider',  toolName: 'Change objloc threshold', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.OBJ_LOC_ROTATION_MODE] = { type: 'check', toolName: 'Change objloc rotation mode', defaultValue: false };
    this.defaultSettings[ECommands.OBJ_LOC_ROTATION_SEARCH] = { type: 'slider',  toolName: 'Change objloc rotation search', defaultValue: 0, min: 0, max: 180 };
    this.defaultSettings[ECommands.OBJ_LOC_SCALED_SEARCH] = { type: 'check', toolName: 'Change objloc scaled search', defaultValue: false };
    this.defaultSettings[ECommands.OBJ_LOC_ROBUSTNESS] = { type: 'radio', toolName: 'Change objloc robustness', defaultValue: 'Normal', labels: ['High robustness', 'Normal', 'High speed'] };
    this.defaultSettings[ECommands.OBJ_LOC_ACCURACY] = { type: 'radio', toolName: 'Change objloc accuracy', defaultValue: 'Normal', labels: ['High accuracy', 'Normal', 'High speed'] };

    // Blob
    this.defaultSettings[ECommands.BLOB_INTENSITY_THRESHOLD] = { type: 'slider', toolName: 'Change blob intensity treshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.BLOB_AREA_THRESHOLD] = { type: 'slider', toolName: 'Change blob area threshold', defaultValue: [10, 307200], min: 10, max: 307200, range: true };

    // TODO: Get and set max here
    // defaultSettings[CE.BLOB_ANGLE_THRESHOLD] : ... Has two values to adjust

    this.defaultSettings[ECommands.BLOB_STRUCTURE_THRESHOLD] = { type: 'slider', toolName: 'Change blob structure threshold', defaultValue: [0, 100000], min: 0, max: 100000, range: true };
    this.defaultSettings[ECommands.BLOB_EDGE_STRENGTH] = { type: 'slider', toolName: 'Change blob edge strenght', defaultValue: [0, 100], min: 0, max: 100 };
    this.defaultSettings[ECommands.BLOB_AMBIENT_LIGHT] = { type: 'check', toolName: 'Change blob ambient light', defaultValue: false };
    this.defaultSettings[ECommands.BLOB_SEARCH_METHOD] = { type: 'radio', toolName: 'Change blob search method', defaultValue: 'Normal', labels: ['High quality', 'Normal', 'High speed'] };
    this.defaultSettings[ECommands.BLOB_NO_BLOB_THRESHOLD] = { type: 'slider', toolName: 'Change blob no blob threshold', defaultValue: [0, 16],  min: 0, max: 16, range: true };

    // Polygon
    this.defaultSettings[ECommands.POLYGON_POSITION_TOLERANCE] = { type: 'slider', toolName: 'Change polygon position tolerance', defaultValue: 1, min: 1, max: 400 };
    this.defaultSettings[ECommands.POLYGON_FLEXIBILITY_TOLERANCE] = { type: 'slider', toolName: 'Change polygon flexibility tolerance', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_SCORE_THRESHOLD] = { type: 'slider', toolName: 'Change polygon score treshold', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_MARGIN] = { type: 'slider', toolName: 'Change polygon margin', defaultValue: 0, min: 0, max: 20  };
    this.defaultSettings[ECommands.POLYGON_DEFECT_DETECTION_WIDTH] = { type: 'slider', toolName: 'Change polygon defect detection width', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_DEFECT_INTENSITY_THRESHOLD] = { type: 'slider', toolName: 'Change polygon defect intensity threshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.POLYGON_MAX_DEFECTS_THRESHOLD] = { type: 'slider', toolName: 'Change polygon max defect threshold', defaultValue: [0, 100], min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_DEFECT_DETECTION_MODE] = { type: 'check', toolName: 'Change polygon defect mode', defaultValue: false };

    // Pixel Counter
    this.defaultSettings[ECommands.PIXEL_INTENSITY_THRESHOLD] = { type: 'slider', toolName: 'Change pixel intensity threshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.PIXEL_NO_PIXELS_THRESHOLD] = { type: 'slider', toolName: 'Change pixel no pixel  threshold', dynamic: 'max', defaultValue: [0, 0], min: 0, max: 0, range: true };

    // Edge pixel counter
    this.defaultSettings[ECommands.EDGE_PIXEL_EDGE_STRENGTH] = { type: 'slider', toolName: 'Change edge pixel strenght', defaultValue: 0 };
    this.defaultSettings[ECommands.EDGE_PIXEL_NO_PIXELS_THRESHOLD] = { type: 'slider', toolName: 'Change edge pixel no pixel threshold', dynamic: 'max', defaultValue: [0, 0], min: 0, max: 0, range: true };

    // Pattern
    this.defaultSettings[ECommands.PATTERN_POSITION_TOLERANCE] = { type: 'slider', toolName: 'Change pattern position tolerance', defaultValue: 0, min: 0, max: 4 };
    this.defaultSettings[ECommands.PATTERN_SCORE_THRESHOLD] = { type: 'slider', toolName: 'Change pattern score threshold', defaultValue: false };

    // Edge locator
    this.defaultSettings[ECommands.EDGE_LOC_EDGE_CONTRAST] = { type: 'slider', toolName: 'Change edge loc edge contrast', defaultValue: 0 };
    this.defaultSettings[ECommands.EDGE_LOC_LINE_FIT_CRITERIA] = { type: 'radio', toolName: 'Change edge loc line fit criteria', defaultValue: 'First', labels: ['Strongest', 'First', 'Last'] };
    this.defaultSettings[ECommands.EDGE_LOC_POLARITY] = { type: 'radio', toolName: 'Change edge loc polarity', defaultValue: 'Bright to Dark', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    this.defaultSettings[ECommands.EDGE_LOC_SCORE_THRESHOLD] = { type: 'slider', toolName: 'Change edge loc score threshold', defaultValue: false };

    // Circle locator
    this.defaultSettings[ECommands.CIRCLE_LOC_EDGE_CONTRAST] = { type: 'slider', toolName: 'Change circle loc edge contrast', defaultValue: 0 };
    this.defaultSettings[ECommands.CIRCLE_LOC_DIAMETER_THRESHOLD] = { type: 'slider', toolName: 'Change circle loc threshold', defaultValue: [0, 500], min: 0, max: 500, range: true, unit: 0 };
    this.defaultSettings[ECommands.CIRCLE_LOC_LINE_FIT_CRITERIA] = { type: 'radio', toolName: 'Change circle loc line fit criteria', defaultValue: 'Smallest', labels: ['Strongest', 'Smallest', 'Largest'] };
    this.defaultSettings[ECommands.CIRCLE_LOC_POLARITY] = { type: 'radio', toolName: 'Change circle loc polarity', defaultValue: 'Bright to Dark', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    this.defaultSettings[ECommands.CIRCLE_LOC_ROBUSTNESS] = { type: 'slider', toolName: 'Change circle loc robustness', defaultValue: 0, min: 0, max: 4 };
    this.defaultSettings[ECommands.CIRCLE_LOC_SCORE_THRESHOLD] = { type: 'slider', toolName: 'Change circle loc score threshold', defaultValue: 0 };
    this.defaultSettings[ECommands.CIRCLE_LOC_QUALITY] = { type: 'slider', toolName: 'Change circle loc quality', defaultValue: 0, min: 0, max: 6 };
    this.defaultSettings[ECommands.CIRCLE_LOC_DIAMETER_OFFSET] = { type: 'slider', toolName: 'Change circle loc diameter offset', defaultValue: -1000, min: -1000, max: 1000, range: false, multiplier: 1000, unit: 0 };
    this.defaultSettings[ECommands.CIRCLE_LOC_DIAMETER_THRESHOLD] = { type: 'slider', toolName: 'Change circle loc diameter threshold', defaultValue: [0, 640], min: 0, max: 640, range: true, multiplier: 1000, unit: 0 };

    // Distance
    this.defaultSettings[ECommands.DISTANCE_THRESHOLD] = { type: 'slider', toolName: 'Change distance threshold', defaultValue: [0, 307200], min: 0, max: 307200, range: true, multiplier: 1000, unit: 0 };
    this.defaultSettings[ECommands.DISTANCE_OFFSET] = { type: 'slider', toolName: 'Change distance offset', defaultValue: -1000, min: -1000, max: 1000, range: false, multiplier: 1000, unit: 0 };

    // Angle
    this.defaultSettings[ECommands.ANGLE_THRESHOLD] = { type: 'slider', toolName: 'Change angle threshold', defaultValue: [0, 180], min: 0, max: 180, range: true, multiplier: 1000 };
    this.defaultSettings[ECommands.ANGLE_OFFSET] = { type: 'slider', toolName: 'Change angle offset', defaultValue: -1000, min: -1000, max: 1000, range: false, multiplier: 1000 };
  
    // Actions
    this.defaultSettings[EActions.SAVE_TO_FLASH] = { type: 'button', toolName: 'Save Flash', defaultValue: 0 };
    this.defaultSettings[EActions.RETEACH_REF_OBJ] = { type: 'button', toolName: 'Reteach Object', defaultValue: 0 };
    this.defaultSettings[EActions.PERFORM_CALIBRATION] = { type: 'button', toolName: 'Perfotm calibration', defaultValue: 0 };
    this.defaultSettings[EActions.REMOVE_CALIBRATION] = { type: 'button', toolName: 'Remove calibration', defaultValue: 0 };
    this.defaultSettings[EActions.APPLY_IP_SETTINGS] = { type: 'button', toolName: 'Apply IP settings', defaultValue: 0 };
    this.defaultSettings[EActions.REBOOT_DEVICE] = { type: 'button', toolName: 'Reboot device', defaultValue: 0 };
    this.defaultSettings[EActions.PERFORM_ALIGNMENT] = { type: 'button', toolName: 'Perform alignment', defaultValue: 0 };
  }

  /**
   * @info Get only one Inspector object
   * @param ip Device valid IP adress
   * @returns Inspector object
   */
  public static getInstance(ip: string): InspectorService {
    try {
      if (ipRegex({exact: true}).test(ip)){
        if (!this._devices.length){ // If _devices empty create new device instance
          this._classInstance = new InspectorService(ip);
          this._devices.push(this._classInstance);
        } else {
          this._classInstance = this._devices.filter(camera => camera.getCameraIP === ip)[0] // else return exiting instance
          if (!this._classInstance){
            this._classInstance = new InspectorService(ip);
            this._devices.push(this._classInstance);
          }
        }
    } else {
      // If IP is wrong          
      throw {
        name: "Inspector object error",
        message: "IP incorrect",
        toString: function(){return this.name + ": " + this.message} 
      }
    }
    } catch (e) {
      console.error(e.toString());
      return null;
    }
    
    return this._classInstance;
  }

  // public static removeInstance(ip: string) {
  //   if (this._devices.length && ipRegex({exact: true}).test(ip)) {
  //     this._devices.filter(camera => {
  //       if (camera.getCameraIP === ip) {

  //       }
  //     })
  //   }
  // }

  /**
   * @info Get baseIP
   * @return BaseIP
   */
  public get getCameraIP() {
    return this._baseIP;
  }

  private inEditMode(mode: number) {
    return mode == 1;
  }
  
  /**
   * @info Just join params
   * @param args Array<number> | number params
   * @returns String like '1_2_3'
   */
  private _joinParams = (args?: Array<number> | number): string => {
    const normalArray = args;
    if (Array.isArray(normalArray) && normalArray.length)
      return normalArray.join('_')
    return `${args}`
  }

  /**
   * @info Make request wrapper
   * @param command Specific command
   * @returns /GET promise
   */
  private sendCommand = (command: string): Promise<ICustomAxiosResponse> => {
    return this.request({
      method: 'GET',
      url: `CmdChannel?${command}`,
      parse: true,
      timeout: 5000,
    })
  }

  // ***************************************** VIEWER *****************************************

  /**
   * @info Return blob image item
   * @param id Unique image id
   * @param s Image size: 1 - big, 2 - small
   * @param type Overlay option: 'ShowOverlay', 'SimplifiedOverlay', ''
   * @returns /GET promise
   */
  public getLiveImage = (id: number, s: EImageSize, type?: EOverlay): Promise<ICustomAxiosResponse> => {
    return this.request({
      method: 'GET',
      responseType: 'blob',
      url: `/LiveImage.jpg${type? `?${type}` : ''}`,
      parse: true,
      timeout: 1000,
      params: { id, s },
    })
  }

  /**
   * @info Return marked image statistic
   * @param id Unique image id 
   * @param s Image size: 1 - big, 2 - small
   * @returns /GET promise
   */
   public getLiveStatistic = (id: string): Promise<ICustomAxiosResponse> => {
    return this.request({
      method: 'GET',
      responseType: 'json',
      url: '/ImageResult',
      parse: true,
      timeout: 1000,
      params: { id },
    })
  }

  /**
   * @info Retrieve the latest available Ethernet Result Output string
   * @returns /GET promise
   */
   public getResult = (): Promise<ICustomAxiosResponse> => {
    return this.sendCommand('gRES');
  }

  /**
   * @info Retrieve the latest statistics from the device
   * @returns /GET promise
   */
   public getStatistics = (): Promise<ICustomAxiosResponse> => {
    return this.sendCommand('gSTAT');
  }

  // ******************************************************************************************

  // ***************************************** LOGGER *****************************************

  /**
   * @info Lock | Unlock logger
   * @param lock true/false 
   * @returns /POST
   */
  public setLogState = (lock: boolean): Promise<ICustomAxiosResponse> => {
    return this.request({
      method: 'POST',
      url: lock? `/LockLog` : `/LockLog?Unlock`,
      parse: false,
      timeout: 1000,
      params: {},
    })
  }

  /**
   * @info Return blob log image
   * @param id Number of LogImage
   * @param type 'ShowOverlay'| 'SimplifiedOverlay' | ''
   * @returns /GET 
   */
  public getLogImage = (id: number, s?: EImageSize,  type?: EOverlay): Promise<ICustomAxiosResponse> => {
    return this.request({
      method: 'GET',
      url: `/LogImage.jpg?${id < 10 ? "0" + id : id}${type? `&${type}` : ''}`,
      responseType: 'blob',
      parse: false,
      timeout: 1000,
      params: {},
    })
  }

  // ******************************************************************************************

  // ***************************************** COMMANDS *****************************************

  /**
   * @info Get protocol version that is supported by the addressed device
   * @returns /GET promise
   */
  public getVersion = (): Promise<ICustomAxiosResponse> => {
    return this.sendCommand('gVER');
  }

  /**
   * @info Get the current device mode from the device (0 = Run, 1 = Edit)
   * @returns /GET promise
   */
  public getMode = (): Promise<ICustomAxiosResponse> => {
    return this.sendCommand('gMOD');
  }

  /**
   * @info Set device mode (0 = Run, 1 = Edit)
   * @param mode 0 - RUN, 1 - EDIT
   * @returns /GET promise
   */
  public setMode = (mode: TCamMode): Promise<ICustomAxiosResponse> => {
    return this.sendCommand(`sMOD_${mode}`);
  }

  /**
   * @info Get “integer” parameter from the device
   * @param id ID specific command
   * @param args One or multi params 
   * @returns /GET promise
   */
  public getInt = (id: ECommands, args?: number[]): Promise<ICustomAxiosResponse> => {
    if (args.length) 
      return this.sendCommand(`gINT_${id}_${this._joinParams(args)}`);
    return this.sendCommand(`gINT_${id}`);
  }

  /**
   * @info Set “integer” parameter in the device
   * @param id ID specific command
   * @param args One or multi params 
   * @returns /GET promise
   */
  public setInt = async (id: ECommands, args?: number[]): Promise<ICustomAxiosResponse> => {
    try {
      const resp = await this.getMode();
      this.deviceMode = resp.data;
      if (this.inEditMode(this.deviceMode)) {
        if (args.length)
          return this.sendCommand(`sINT_${id}_${this._joinParams(args)}`);
        return this.sendCommand(`sINT_${id}`);
      } else {
        return Promise.reject(new Error("Camera in RUN mode! Please, switch to edit mode..."));
      }
    } catch (e) {
      return await Promise.reject(new Error("Camera doesn't response..."));
    }
  }

  /**
   * @info Get "string" parameter from device
   * @param id ID specific string command
   * @param args One or multi params 
   * @returns /GET promise
   */
  public getString = (id: EgetString, args?: number | number[]): Promise<ICustomAxiosResponse> => {
    if (args) 
      return this.sendCommand(`gSTR_${id}_${this._joinParams(args)}`);
    return this.sendCommand(`gSTR_${id}`);
  }

  /**
   * @info Action commands
   * @param id ID specific action
   * @param args One or multi params 
   * @returns /GET promise
   */
  public performAction = (id: EActions, args?: number[]): Promise<ICustomAxiosResponse> => {
    return this.getMode()
    .then(resp => {
      this.deviceMode = resp.data;
      if ((id === EActions.SAVE_TO_FLASH || 
        id === EActions.PERFORM_CALIBRATION || 
        id === EActions.REMOVE_CALIBRATION || 
        id === EActions.PERFORM_ALIGNMENT)){
          if (!this.inEditMode(this.deviceMode))
            return Promise.reject(new Error("Camera in RUN mode! Please, switch to edit mode..."));
      }

      if (args) 
        return this.sendCommand(`aACT_${id}_${this._joinParams(args)}`);
      return this.sendCommand(`aACT_${id}`);
    })
    .catch(e => {
      return Promise.reject(new Error("Camera doesn't response..."));
    })
  }

  /**
   * @info Trig an image acquisition and analysis
   * @returns /GET promise
   */
  public trig = (): Promise<ICustomAxiosResponse> => {
    return this.sendCommand(`TRIG`);
  }
  // ********************************************************************************************
}

export type TInspectorService = InspectorService

export {
  ECommands,
  EgetString,
  EActions,
  EOverlay,
  EImageSize
}

export default InspectorService