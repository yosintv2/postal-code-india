export interface PostOffice {
  officeName: string;
  pincode: string;
  officeType: 'H.O' | 'S.O' | 'B.O' | string;
  deliveryStatus: 'Delivery' | 'Non-Delivery' | string;
  divisionName: string;
  regionName: string;
  circleName: string;
  taluk: string;
  districtName: string;
  stateName: string;
}

export interface PincodeGroup {
  pincode: string;
  offices: PostOffice[];
  hasHeadOffice: boolean;
}

export interface DistrictData {
  districtName: string;
  districtSlug: string;
  pincodes: PincodeGroup[];
  totalOffices: number;
  pincodeRange: { min: string; max: string };
}

export interface StateData {
  stateName: string;
  stateSlug: string;
  apiFile: string;
  districts: DistrictData[];
  totalDistricts: number;
  totalOffices: number;
}

export interface StateInfo {
  name: string;
  slug: string;
  apiFile: string;
  capital?: string;
  type: 'state' | 'ut';
}
