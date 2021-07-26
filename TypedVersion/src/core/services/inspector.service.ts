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
  // Reference Image
  REF_OBJ = 1,
  REF_GETNOREFOBJ = 2,
  // Setting reference image 
  MAIN_EXPOSURE = 14,
  MAIN_GAIN = 15,
  MAIN_TRIGMODE = 16,
  MAIN_CALIBRATIONMODE = 20,
  MAIN_ILLUMMODE = 13,
  // Device settings p.56
  MAIN_INTERFACEPERMISSION = 112,
  MAIN_IPADDRESS = 120,
  MAIN_NETMASK = 121,
  MAIN_GATEWAY = 122,
  // Object locator
  OBJLOC_MATCHTHRESHOLD = 32,
  OBJLOC_ROTATIONMODE = 33,
  OBJLOC_ROTATIONSEARCH = 34,
  OBJLOC_SCALEDSEARCH = 35,
  OBJLOC_ROBUSTNESS = 36,
  OBJLOC_ACCURACY = 37,
  OBJLOC_MOVEROTATE = 38,
  // Blob 
  BLOB_INTENSITYTHRESHOLD = 48,
  BLOB_AREATHRESHOLD = 49,
  // BLOB_ANGLETHRESHOLD = 50,
  BLOB_STRUCTURETHRESHOLD = 53,
  BLOB_EDGESTRENGTH = 54,
  BLOB_AMBIENTLIGHT = 55,
  BLOB_SEARCHMETHOD = 56,
  //BLOB_MOVEROTATE = 58,
  BLOB_NOBLOBTHRESHOLD = 59,
  // Polygon
  POLYGON_POSITIONTOLERANCE = 64,
  POLYGON_FLEXIBILITYTOLERANCE = 65,
  POLYGON_SCORETHRESHOLD = 66,
  POLYGON_MARGIN = 67,
  POLYGON_DEFECTDETECTIONWIDTH = 68,
  POLYGON_DEFECTINTENSITYTHRESHOLD = 69,
  POLYGON_MAXDEFECTSTHRESHOLD = 70,
  POLYGON_DEFECTDETECTIONMODE = 71,
  POLYGON_MOVEROTATE = 72,
  POLYGON_MOVECORNER = 73,
  // Pixel counter
  PIXEL_INTENSITYTHRESHOLD = 80,
  PIXEL_NOPIXELSTHRESHOLD = 81,
  // Edge pixel counter
  EDGEPIXEL_EDGESTRENGTH = 82,
  EDGEPIXEL_NOPIXELSTHRESHOLD = 83,
  // Pattern
  PATTERN_POSITIONTOLERANCE = 84,
  PATTERN_SCORETHRESHOLD = 85,
  // Move and rotate inspections
  ADDT_INSPECTIONMOVEROTATE = 86,
  // Get ROI size
  ADDT_GETROISIZE = 87,
  // Edge locator
  EDGELOC_EDGECONTRAST = 150,
  EDGELOC_LINEFITCRITERIA = 151,
  EDGELOC_POLARITY = 152,
  EDGELOC_SCORETHRESHOLD = 153,
  // Circle locator
  CIRCLELOC_EDGECONTRAST = 160,
  CIRCLELOC_DIAMETERTHRESHOLD = 161,
  CIRCLELOC_LINEFITCRITERIA = 162,
  CIRCLELOC_POLARITY = 163,
  CIRCLELOC_ROBUSTNESS = 164,
  CIRCLELOC_SCORETHRESHOLD = 165,
  CIRCLELOC_QUALITY = 166,
  CIRCLELOC_DIAMETEROFFSET = 167,
  CIRCLELOC_DIAMETERTOLERANCETHRESHOLD = 169,
  // Distance
  DISTANCE_THRESHOLD = 170,
  DISTANCE_OFFSET = 173,
  // Angle
  ANGLE_THRESHOLD = 180,
  ANGLE_OFFSET = 181,
  // Edge Counter
  EDGECOUNTER_EDGECONTRAST = 190,
  EDGECOUNTER_EDGEQUIALITY = 191,
  EDGECOUNTER_FEATUREWIDTH = 192,
  EDGECOUNTER_FEATURETYPE = 193,
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
    this.defaultSettings[ECommands.MAIN_EXPOSURE] = { type: 'slider', toolName: 'Change exposure', defaultValue: 0.1, min: 0.1, max: 100, multiplier: 100 };
    this.defaultSettings[ECommands.MAIN_GAIN] = { type: 'slider', toolName: 'Change gain', defaultValue: 100, min: 100, max: 400 };
    this.defaultSettings[ECommands.MAIN_TRIGMODE] = { type: 'radio', toolName: 'Change trig mode', defaultValue: 'Free-running',  labels: ['Free-running', 'Triggered'] };

    // 1) Object locator
    this.defaultSettings[ECommands.OBJLOC_MATCHTHRESHOLD] = { type: 'slider',  toolName: 'Change objloc threshold', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.OBJLOC_ROTATIONMODE] = { type: 'check', toolName: 'Change objloc rotation mode', defaultValue: false };
    this.defaultSettings[ECommands.OBJLOC_ROTATIONSEARCH] = { type: 'slider',  toolName: 'Change objloc rotation search', defaultValue: 0, min: 0, max: 180 };
    this.defaultSettings[ECommands.OBJLOC_SCALEDSEARCH] = { type: 'check', toolName: 'Change objloc scaled search', defaultValue: false };
    this.defaultSettings[ECommands.OBJLOC_ROBUSTNESS] = { type: 'radio', toolName: 'Change objloc robustness', defaultValue: 'Normal', labels: ['High robustness', 'Normal', 'High speed'] };
    this.defaultSettings[ECommands.OBJLOC_ACCURACY] = { type: 'radio', toolName: 'Change objloc accuracy', defaultValue: 'Normal', labels: ['High accuracy', 'Normal', 'High speed'] };

    // 2) Pixel Counter
    this.defaultSettings[ECommands.PIXEL_INTENSITYTHRESHOLD] = { type: 'slider', toolName: 'Change pixel intensity threshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.PIXEL_NOPIXELSTHRESHOLD] = { type: 'slider', toolName: 'Change pixel no pixel  threshold', dynamic: 'max', defaultValue: [0, 0], min: 0, max: 0, range: true };

    // 3) Edge pixel counter
    this.defaultSettings[ECommands.EDGEPIXEL_EDGESTRENGTH] = { type: 'slider', toolName: 'Change edge pixel strenght', defaultValue: 0 };
    this.defaultSettings[ECommands.EDGEPIXEL_NOPIXELSTHRESHOLD] = { type: 'slider', toolName: 'Change edge pixel no pixel threshold', dynamic: 'max', defaultValue: [0, 0], min: 0, max: 0, range: true };

    // 4) Pattern
    this.defaultSettings[ECommands.PATTERN_POSITIONTOLERANCE] = { type: 'slider', toolName: 'Change pattern position tolerance', defaultValue: 0, min: 0, max: 4 };
    this.defaultSettings[ECommands.PATTERN_SCORETHRESHOLD] = { type: 'slider', toolName: 'Change pattern score threshold', defaultValue: false };

    // 5) Blob
    this.defaultSettings[ECommands.BLOB_INTENSITYTHRESHOLD] = { type: 'slider', toolName: 'Change blob intensity treshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.BLOB_AREATHRESHOLD] = { type: 'slider', toolName: 'Change blob area threshold', defaultValue: [10, 307200], min: 10, max: 307200, range: true };
    // TODO: Get and set max here
    // defaultSettings[CE.BLOB_ANGLE_THRESHOLD] : ... Has two values to adjust
    this.defaultSettings[ECommands.BLOB_STRUCTURETHRESHOLD] = { type: 'slider', toolName: 'Change blob structure threshold', defaultValue: [0, 100000], min: 0, max: 100000, range: true };
    this.defaultSettings[ECommands.BLOB_EDGESTRENGTH] = { type: 'slider', toolName: 'Change blob edge strenght', defaultValue: [0, 100], min: 0, max: 100 };
    this.defaultSettings[ECommands.BLOB_AMBIENTLIGHT] = { type: 'check', toolName: 'Change blob ambient light', defaultValue: false };
    this.defaultSettings[ECommands.BLOB_SEARCHMETHOD] = { type: 'radio', toolName: 'Change blob search method', defaultValue: 'Normal', labels: ['High quality', 'Normal', 'High speed'] };
    this.defaultSettings[ECommands.BLOB_NOBLOBTHRESHOLD] = { type: 'slider', toolName: 'Change blob no blob threshold', defaultValue: [0, 16],  min: 0, max: 16, range: true };

    // 6) Polygon
    this.defaultSettings[ECommands.POLYGON_POSITIONTOLERANCE] = { type: 'slider', toolName: 'Change polygon position tolerance', defaultValue: 1, min: 1, max: 400 };
    this.defaultSettings[ECommands.POLYGON_FLEXIBILITYTOLERANCE] = { type: 'slider', toolName: 'Change polygon flexibility tolerance', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_SCORETHRESHOLD] = { type: 'slider', toolName: 'Change polygon score treshold', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_MARGIN] = { type: 'slider', toolName: 'Change polygon margin', defaultValue: 0, min: 0, max: 20  };
    this.defaultSettings[ECommands.POLYGON_DEFECTDETECTIONWIDTH] = { type: 'slider', toolName: 'Change polygon defect detection width', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_DEFECTINTENSITYTHRESHOLD] = { type: 'slider', toolName: 'Change polygon defect intensity threshold', defaultValue: [0, 255], min: 0, max: 255, range: true };
    this.defaultSettings[ECommands.POLYGON_MAXDEFECTSTHRESHOLD] = { type: 'slider', toolName: 'Change polygon max defect threshold', defaultValue: [0, 100], min: 0, max: 100 };
    this.defaultSettings[ECommands.POLYGON_DEFECTDETECTIONMODE] = { type: 'check', toolName: 'Change polygon defect mode', defaultValue: false };

    // 7) Edge locator
    this.defaultSettings[ECommands.EDGELOC_EDGECONTRAST] = { type: 'slider', toolName: 'Change edge loc edge contrast', defaultValue: 0 };
    this.defaultSettings[ECommands.EDGELOC_LINEFITCRITERIA] = { type: 'radio', toolName: 'Change edge loc line fit criteria', defaultValue: 'First', labels: ['Strongest', 'First', 'Last'] };
    this.defaultSettings[ECommands.EDGELOC_POLARITY] = { type: 'radio', toolName: 'Change edge loc polarity', defaultValue: 'Bright to Dark', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    this.defaultSettings[ECommands.EDGELOC_SCORETHRESHOLD] = { type: 'slider', toolName: 'Change edge loc score threshold', defaultValue: false };

    // 8) Circle locator
    this.defaultSettings[ECommands.CIRCLELOC_EDGECONTRAST] = { type: 'slider', toolName: 'Change circle loc edge contrast', defaultValue: 0 };
    this.defaultSettings[ECommands.CIRCLELOC_DIAMETERTHRESHOLD] = { type: 'slider', toolName: 'Change circle loc threshold', defaultValue: [0, 500], min: 0, max: 500, range: true, unit: 0 };
    this.defaultSettings[ECommands.CIRCLELOC_LINEFITCRITERIA] = { type: 'radio', toolName: 'Change circle loc line fit criteria', defaultValue: 'Smallest', labels: ['Strongest', 'Smallest', 'Largest'] };
    this.defaultSettings[ECommands.CIRCLELOC_POLARITY] = { type: 'radio', toolName: 'Change circle loc polarity', defaultValue: 'Bright to Dark', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    this.defaultSettings[ECommands.CIRCLELOC_ROBUSTNESS] = { type: 'slider', toolName: 'Change circle loc robustness', defaultValue: 0, min: 0, max: 4, range: 'min' };
    this.defaultSettings[ECommands.CIRCLELOC_SCORETHRESHOLD] = { type: 'slider', toolName: 'Change circle loc score threshold', defaultValue: 0 };
    this.defaultSettings[ECommands.CIRCLELOC_QUALITY] = { type: 'slider', toolName: 'Change circle loc quality', defaultValue: 0, min: 0, max: 6, range: 'min' };
    this.defaultSettings[ECommands.CIRCLELOC_DIAMETEROFFSET] = { type: 'slider', toolName: 'Change circle loc diameter offset', defaultValue: -1000, min: -1000, max: 1000, range: 'min', multiplier: 1000, unit: 0 };
    // ??? doubled slider 
    // this.defaultSettings[ECommands.CIRCLE_LOC_DIAMETER_TOLERANCE_THRESHOLD] = { type: 'slider', toolName: 'Change circle loc diameter threshold' };

    // 9) Distance
    this.defaultSettings[ECommands.DISTANCE_THRESHOLD] = { type: 'slider', toolName: 'Change distance threshold', defaultValue: [0, 307200], min: 0, max: 307200, range: true, multiplier: 1000, unit: 0 };
    this.defaultSettings[ECommands.DISTANCE_OFFSET] = { type: 'slider', toolName: 'Change distance offset', defaultValue: -1000, min: -1000, max: 1000, range: 'min', multiplier: 1000, unit: 0 };

    // 10) Angle
    this.defaultSettings[ECommands.ANGLE_THRESHOLD] = { type: 'slider', toolName: 'Change angle threshold', defaultValue: [0, 180], min: 0, max: 180, range: true, multiplier: 1000 };
    this.defaultSettings[ECommands.ANGLE_OFFSET] = { type: 'slider', toolName: 'Change angle offset', defaultValue: -1000, min: -1000, max: 1000, range: 'min', multiplier: 1000 };
  
    // 11) Edge counter 
    this.defaultSettings[ECommands.EDGECOUNTER_EDGECONTRAST] = { type: 'slider', toolName: 'Change Edge counter edge contrast', range: 'min', defaultValue: 100, min: 0, max: 100, multiplier: 1000 }
    this.defaultSettings[ECommands.EDGECOUNTER_EDGEQUIALITY] = { type: 'slider', toolName: 'Change Edge counter edge quality', defaultValue: 0, min: 0, max: 6, range: 'min' }
    this.defaultSettings[ECommands.EDGECOUNTER_FEATUREWIDTH] = { type: 'slider', toolName: 'Change Edge counter feature width', defaultValue: 0, min: 0, max: 640, range: 'min', multiplier: 10 }
    this.defaultSettings[ECommands.EDGECOUNTER_FEATURETYPE] = { type: 'radio', toolName: 'Change Edge counter feature type', defaultValue: 'Bright',  labels: ['Bright', 'Dark', 'Single Edge'] }

    // Actions
    this.defaultSettings[EActions.SAVE_TO_FLASH] = { type: 'button', toolName: 'Save Flash', defaultValue: 0 };
    this.defaultSettings[EActions.RETEACH_REF_OBJ] = { type: 'button', toolName: 'Reteach Object', defaultValue: 0 };
    this.defaultSettings[EActions.PERFORM_CALIBRATION] = { type: 'button', toolName: 'Perfotm calibration', defaultValue: 0 };
    this.defaultSettings[EActions.REMOVE_CALIBRATION] = { type: 'button', toolName: 'Remove calibration', defaultValue: 0 };
    this.defaultSettings[EActions.APPLY_IP_SETTINGS] = { type: 'button', toolName: 'Apply IP settings', defaultValue: 0 };
    this.defaultSettings[EActions.REBOOT_DEVICE] = { type: 'button', toolName: 'Reboot device', defaultValue: 0 };
    this.defaultSettings[EActions.PERFORM_ALIGNMENT] = { type: 'button', toolName: 'Perform alignment', defaultValue: 0 };
  }

  public get getCameraIP() {
    return this._baseIP
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
          this._classInstance = this._devices.find(camera => camera.getCameraIP === ip) // else return exiting instance
          if (!this._classInstance){
            this._classInstance = new InspectorService(ip);
            this._devices.push(this._classInstance);
          }
        }
      } else {
        // If IP is wrong          
        throw new Error("Inspector object error - IP incorrect")
      }
    } catch (e) {
      console.error(e);
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
  private sendCommand = async (command: string): Promise<ICustomAxiosResponse> => {
    const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await timeout(1000);

    return this.request({
      responseType: 'text',
      method: 'GET',
      url: `CmdChannel?${command}`,
      parseCmd: true,
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
      parseCmd: true,
      timeout: 5000,
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
      parseCmd: true,
      timeout: 5000,
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
      timeout: 5000,
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
      timeout: 5000,
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

  /**
   * @info Return string[] tool's names
   * @returns /GET promise
   */
  public getTools = (refID: number): Promise<ICustomAxiosResponse> => {
    return this.request({
      responseType: 'json',
      parseJson: 'tools',
      method: 'GET',
      url: `CmdChannel?${EgetString.GET_NAME_ALL}_${refID}_1`,
      timeout: 5000,
    })
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