import ipRegex from "ip-regex";
import Bottleneck from "bottleneck";
import HttpClient from 'Src/core/services/http';
import { handlePromise, delayPromise } from 'Src/core/utils/http-utils'
import { TWidget, 
  TCommandResponse, 
  EImageSize, 
  EOverlay, 
  TCamMode, 
  EgetString, 
  EActions, 
  ECommands, 
} from "./inspector.interface";

/**
 * Main class with request/response ability and feature as api-wrapper i guess
 */

class InspectorService extends HttpClient {
  private _limiter?: Bottleneck;
  // private static _classInstance?: InspectorService;
  private static _devices?: Set<InspectorService> = new Set(); // Array of cameras
  private _deviceMode?: number;
  public defaultSettings: Array<TWidget> = []; // Array of default widgets

  /**
   * @info Create default settings
   * @param ip 
   */
  private constructor(ip: string) {
    super(ip);

    this._limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 333
    });

    // Image settings
    this.defaultSettings[ECommands.MAIN_EXPOSURE] = { type: 'slider', toolName: 'Change exposure', defaultValue: 0.1, min: 0.01, max: 10, multiplier: 100 };
    this.defaultSettings[ECommands.MAIN_GAIN] = { type: 'slider', toolName: 'Change gain', defaultValue: 0, min: 0, max: 400 };
    this.defaultSettings[ECommands.MAIN_TRIGMODE] = { type: 'radio', toolName: 'Change trig mode', defaultValue: 'Free-running',  labels: ['Free-running', 'Triggered'] };

    // 1) Object locator
    this.defaultSettings[ECommands.OBJLOC_MATCHTHRESHOLD] = { type: 'slider',  toolName: 'Change objloc threshold', defaultValue: 0, min: 0, max: 100 };
    this.defaultSettings[ECommands.OBJLOC_ROTATIONMODE] = { type: 'check', toolName: 'Change objloc rotation search mode', defaultValue: false };
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
    // TODO:... Has two values to adjust defaultSettings[CE.BLOB_ANGLE_THRESHOLD] :
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
    // TODO doubled slider this.defaultSettings[ECommands.CIRCLE_LOC_DIAMETER_TOLERANCE_THRESHOLD] = { type: 'slider', toolName: 'Change circle loc diameter threshold' };

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

  /**
   * @info Get camera IP
   * @return string IP
   */
  public get cameraIP(): string {
    return this._baseIP
  }

  /**
   * @info Get only one Inspector object
   * @param ip Device valid IP adress
   * @returns InspectorService
   */
  public static addDevicesIP(ip: string[]): InspectorService[] {
    try {
      if (ip.every(ip => ipRegex({ exact: true }).test(ip))){
          ip.forEach(ip => this._devices.add(new InspectorService(ip)))
      } else {       
        throw new Error("Inspector object error - one of provided IPs is incorrect!")
      }
    } catch (e: any) {
      console.trace(e);
      throw new Error("System error!")
    }

    return Array.from(this._devices);
  }

  /**
   * @info Get device by IP adress
   * @param ip 
   * @returns InspectorService
   */
  public static getDevice(ip: string): InspectorService {
    try {
      if (ipRegex({ exact: true }).test(ip)) {
        const camera = Array.from(this._devices).find((device) => device.cameraIP === ip)
        return camera;
      }
    } catch (error) {
      throw new Error("Inspector object error - IP incorrect or device not found!")
    }
  }

  /**
   * @info Camera mode
   * @param mode 
   * @returns boolean mode
   */
  private inEditMode(mode: number): boolean {
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
   * @returns array of numbers
   */
  private sendCommand = async (command: string): Promise<TCommandResponse> => {
    const wrapped = 
    // this._limiter.wrap
    (
      () => handlePromise(this.request<string[]>({
      responseType: 'text',
      method: 'GET',
      url: `CmdChannel?${command}`,
      parseCmd: true,
      iAmRetry: true,
      timeout: 3000,
    })));

    const [error, response] = await wrapped();

    if(!error && response.data)
      return { error: null, data: response.data }
    
    return { error: error.message, data: null }
  }

  // ***************************************** COMMANDS *****************************************

  /**
   * @info Get protocol version that is supported by the addressed device
   * @returns camera version
   */
   public getVersion = async (): Promise<string> => {
    const { data } = await this.sendCommand('gVER');
    return data[0];
  }

  /**
   * @info Get the current device mode from the device 
   * @returns camera current mode (0 = Run, 1 = Edit)
   */
  public getMode = async(): Promise<number> => {
    const {data} = await this.sendCommand('gMOD');
    return Number(data[0]);
  }

  /**
   * @info Set device mode (0 = Run, 1 = Edit)
   * @param mode 0 - RUN, 1 - EDIT
   * @returns boolean action
   */
  public setMode = async (mode: TCamMode): Promise<boolean> => {
    const {error} = await this.sendCommand(`sMOD_${mode}`);
    return !error;
  }

  /**
   * @info Get “integer” parameter from the device
   * @param id ID specific command
   * @param args One or multi params 
   * @returns string data
   */
  public getInt = async (id: ECommands, args?: number[]): Promise<string[]> => {
    let commandResponse: TCommandResponse;
    
    if (args && args.length) commandResponse = await this.sendCommand(`gINT_${id}_${this._joinParams(args)}`);
    commandResponse = await this.sendCommand(`gINT_${id}`);

    const { data } = commandResponse
    return data;
  }

  /**
   * @info Set “integer” parameter in the device
   * @param id ID specific command
   * @param args One or multi params 
   * @returns boolean action
   */
  public setInt = async (id: ECommands, args?: number[]): Promise<boolean> => {
      this._deviceMode = await this.getMode();
      let commandResponse: TCommandResponse;

      if (this.inEditMode(this._deviceMode)) {
        if (args.length)
          commandResponse = await this.sendCommand(`sINT_${id}_${this._joinParams(args)}`);
        commandResponse = await this.sendCommand(`sINT_${id}`);
      } else {
        return Promise.reject('Camera is not in edit mode.')
      }

      return !commandResponse.error;
  }

  /**
   * @info Get "string" parameter from device
   * @param id ID specific string command
   * @param args One or multi params 
   * @returns string 
   */
  public getString = async (id: EgetString, args?: number | number[]): Promise<string> => {
    let commandResponse: TCommandResponse;

    if (args) 
      commandResponse = await this.sendCommand(`gSTR_${id}_${this._joinParams(args)}`);
    commandResponse = await this.sendCommand(`gSTR_${id}`);

    return commandResponse.data[0];
  }

  // FIXME:
  /**
   * @info Action commands
   * @param id ID specific action
   * @param args One or multi params 
   * @returns result action
   */
  public performAction = async (id: EActions, args?: number[]): Promise<boolean> => {
    this._deviceMode = await this.getMode();

    
      if ((id === EActions.SAVE_TO_FLASH || 
        id === EActions.PERFORM_CALIBRATION || 
        id === EActions.REMOVE_CALIBRATION || 
        id === EActions.PERFORM_ALIGNMENT)) {
          if (!this.inEditMode(this._deviceMode)) {
            return Promise.reject("Camera in RUN mode! Please, switch to edit mode...");
          }
      }

      // switch(id){
      //   case EActions.SAVE_TO_FLASH:
      //       await this.performAction(id, []);
      //       break;
      //   case EActions.RETEACH_REF_OBJ:
      //       await this.performAction(id, [0]);
      //       break;
      //   case EActions.PERFORM_CALIBRATION:
      //       await this.setInt(ECommands.MAIN_CALIBRATIONMODE, [1]);
      //       await this.performAction(id, args);
      //       break;
      //   case EActions.REMOVE_CALIBRATION:
      //       await this.performAction(id, []);
      //       break;
      //   case EActions.APPLY_IP_SETTINGS:
      //       await this.performAction(id, args)
      //       break;
      //   case EActions.REBOOT_DEVICE:
      //       await this.performAction(id, []);
      //       break;
      //   default:
      //       console.log();
      //       break;
      // }

      if (args) 
        return !(await this.sendCommand(`aACT_${id}_${this._joinParams(args)}`)).error;
      return !(await this.sendCommand(`aACT_${id}`)).error;
  }

  /**
   * @info Trig an image acquisition and analysis
   * @returns action 
   */
  public trig = async (): Promise<boolean> => {
    return !(await this.sendCommand(`TRIG`)).error;
  }

  // FIXME: test
  /**
   * @info Return string[] tool's names
   * @returns string
   */
  public getTools = async (refID: number): Promise<string[]> => {
    await delayPromise(3000);

    const [error, response] = await handlePromise(this.request<string[]>({
      responseType: 'json',
      parseJson: 'tools',
      method: 'GET',
      url: `CmdChannel?${EgetString.GET_NAME_ALL}_${refID}_1`,
      timeout: 1000,
    }))

    if (!error) return response.data
    return null
  }
  // ********************************************************************************************

  // ***************************************** VIEWER *****************************************

  /**
   * @info Return set [image, statistic]
   * @param id 
   * @param s 
   * @param type 
   * @returns 
   */
  public getLiveImageWithStatistic = async (id: string, s: EImageSize = EImageSize.SMALL, type: EOverlay = EOverlay.HIDE): Promise<{
    image: string,
    statistic: any
  }> => {

    const [image, statistic] = await Promise.all([this.getLiveImage(id, s, type), this.getLiveStatistic(id)]);

    if (!image && !statistic) return {
      image,
      statistic,
    }

    return {
      image: null,
      statistic: null
    }
  }

  /**
   * @info Return blob image item
   * @param id Unique image id
   * @param s Image size: 1 - big, 2 - small
   * @param type Overlay option: 'ShowOverlay', 'SimplifiedOverlay', ''
   * @returns string URL
   */
  public getLiveImage = async (id: string, s: EImageSize = EImageSize.SMALL, type: EOverlay = EOverlay.HIDE): Promise<string> => {
    const wrapped = 
    this._limiter.wrap
    (
      () => handlePromise(this.request<string>({
      method: 'GET',
      responseType: 'blob',
      iAmRetry: false,
      url: `/LiveImage.jpg${type? `?${type}` : ''}`,
      timeout: 3000,
      params: { id, s },
    })))

    const [error, response] = await wrapped();
    if(!error) return response.data
  }

  /**
   * @info Return marked image statistic
   * @param id Unique image id 
   * @param s Image size: 1 - big, 2 - small
   * @returns /GET promise
   */
   public getLiveStatistic = async (id: string): Promise<any> => {
    const [error, response] = await handlePromise(this.request({
      method: 'GET',
      responseType: 'json',
      url: '/ImageResult',
      iAmRetry: false,
      parseJson: 'statistic',
      timeout: 3000,
      params: { id },
    }))

    if(!error) return response.data
    return null
  }

  /**
   * @info Retrieve the latest available Ethernet Result Output string
   * @returns /GET promise
   */
   public getResult = async (): Promise<string> => {
    const [error, response] = await handlePromise(this.request<string>({
      responseType: 'text',
      method: 'GET',
      url: `CmdChannel?gRES`,
      parseCmd: true,
      timeout: 3000,
    }))

    if (!error) return response.data
    return null
  }

  // FIXME: response XML HOW PARSE THIS???
  // /**
  //  * @info Retrieve the latest statistics from the device
  //  * @returns /GET promise
  //  */
  //  public getStatistics = (): Promise<ICustomAxiosResponse> => {
  //   return this.sendCommand('gSTAT');
  // }

  // ******************************************************************************************

  // ***************************************** REFERENCE IMAGE ********************************

  /**
   * @info Get active recipe image
   * @returns image URL
   */
  public getActiveRecipe = async (): Promise<string> => {
    await delayPromise(3000);

    const [error, response] = await handlePromise(this.request<string>({
      method: 'GET',
      responseType: 'blob',
      url: `/ActiveReferenceImage.jpg`,
      timeout: 3000,
      params: {},
    }))

    if (!error) return response.data
    return null
  }

  /**
   * @info Get recipe image 
   * @param id reference (recipe) id
   * @returns image URL
   */
  public getReferenceObject = async (id: number): Promise<string> => {
    await delayPromise(3000);

    const [error, response] = await handlePromise(this.request<string>({
      method: 'GET',
      responseType: 'blob',
      url: `/getRefObject?${id}`,
      timeout: 30000,
      params: {},
    }))

    if (!error) return response.data
    return null
  }

  /**
   * @info Give recipe name by id
   * @param id 
   * @returns 
   */
  public getRecipeName = async (id: number): Promise<string> => {
    const [error, response] = await handlePromise(this.getString(EgetString.GET_NAME_REF_OBJ, id))
    if (!error) return response
    return null
  }

  /**
   * @info Get recipe names
   * @param count 
   * @returns 
   */
  public getRecipeNames = async (count: number): Promise<string[]> => {
    const recipeNames = Promise.all<string>(Array.from({ length: count }, (_v , k)=> {
      return this.getRecipeName(k);
    }))
    return recipeNames;
  }

  /**
   * @info All recipes
   * @returns 
   */
  public getRecipeCount = async (): Promise<number> => {
    const count = await this.getInt(ECommands.REF_GETNOREFOBJ)
    if (count) return Number(count[0])
    return null;
  }

  /**
   * @info Give me index of active recipe
   * @returns 
   */
  public getActiveReferenceIndex = async (): Promise<number> => {
    const id = await this.getInt(ECommands.REF_OBJ)
    if (id) return Number(id[0])
    return null
  }

  /**
   * @info Update recipe image
   * @param id 
   * @returns 
   */
  public updateRecipe = async(id: number): Promise<boolean>   => {
    return await this.setInt(ECommands.REF_OBJ, [id])
  }

  // ******************************************************************************************

  // ***************************************** LOGGER *****************************************

  /**
   * @info Lock | Unlock logger
   * @param lock true/false 
   * @returns error as Error or undefined
   */
  public setLogState = async (lock: boolean): Promise<boolean> => {
    // await delayPromise(3000);

    const [error, response] = await handlePromise(this.request<boolean>({
      method: 'POST',
      url: lock? `/LockLog` : `/LockLog?Unlock`,
      timeout: 10000,
      params: {},
    }))

    return !error;
  }

  /**
   * @info Return blob log image
   * @param id Number of LogImage
   * @param type 'ShowOverlay'| 'SimplifiedOverlay' | ''
   * @returns logimage URL
   */
  public getLogImage = async (id: number, s?: EImageSize,  type: EOverlay = EOverlay.SHOW): Promise<string> => {
    const [error, response] = await handlePromise(this.request<string>({
      method: 'GET',
      url: `/LogImage.jpg?${id < 10 ? "0" + id : id}${type? `&${type}` : ''}`,
      responseType: 'blob',
      timeout: 30000,
      params: {},
    }))

    if (!error) return response.data;
    return null
  }

  // ******************************************************************************************
}

export default InspectorService