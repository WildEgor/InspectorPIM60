export type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
export type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
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
    type: 'slider' | 'radio' | 'check' | 'button' | 'toggle',
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

export type TCommandResponse = {
    error: string,
    data: string[]
}

export { 
    EOverlay,
    EImageSize,
    EWEbConstants,
    EActions,
    EgetString,
    ECommands,
}