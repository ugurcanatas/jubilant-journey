/**
 * @component : PageType3Query1.jsx
 */
type ICoordinates = {
  latitude: number;
  longitude: number;
};

/**
 * @component : PageType3Query1.jsx
 */
type TCoordinates = number[];

/**
 * @component : PageType3Query1.jsx
 */
type TGeometry = {
  type: string;
  coordinates: [TCoordinates];
};

/**
 * @component : PageType3Query1.jsx
 */
type TFeatures = {
  type: string;
  properties: any;
  geometry: TGeometry;
};

/**
 * @component : PageType3Query1.jsx
 */
type TFeatureCollection = {
  type: string;
  properties?: OptionalID;
  features: [TFeatures];
};

type OptionalID = {
  id: string;
  visible: boolean;
  color: string;
};

/**
 * @component : PageType2Query1.jsx
 */
type TaxiZoneDataTypes = {
  Borough: string;
  Zone: string;
  LocationID: number;
  X: number;
  Y: number;
  Shape_Leng: number;
  Shape_Area: number;
  OBJECTID: number;
};

/**
 * @component : PageType2Query3.jsx
 */
type T_Type2_Query3 = {
  tpep_pickup_datetime: number;
  trip_distance: number;
  tpep_dropoff_datetime: number;
  startDate: string;
  endDate: string;
};

type IDField = {
  custom_id: number;
  dateString: string;
};

type FlatListTypes = {
  _id: IDField;
  avarageTotalAmount?: number;
  sumPassengers?: number;
  total?: number;
  countOfDate?: number;
};

type TypeQ3T1 = {
  trip_distance: number;
  tpep_pickup_datetime: number;
  convertedDate: string;
};

type TypeQ2T3 = {
  trip_distance: number;
  lookup_result: [TaxiZoneDataTypes];
};

type TMinMax = {
  min: number;
  max: number;
  PULocationID: number;
  lookup_result: TaxiZoneDataTypes[];
};

export {
  T_Type2_Query3,
  TaxiZoneDataTypes,
  ICoordinates,
  TCoordinates,
  TFeatures,
  TGeometry,
  TFeatureCollection,
  FlatListTypes,
  TypeQ3T1,
  TypeQ2T3,
  TMinMax,
};
