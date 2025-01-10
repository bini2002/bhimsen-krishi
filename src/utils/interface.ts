import { RequestMethod } from "./RequestMethod";

export interface ICropType {
  id: number;
  createdAt: string;
  type: string;
}

export interface ICropTypesApiResponse {
  success: boolean;
  source: string;
  data: {
    data: ICropType[];
    total: number;
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface ISeason {
  id: number;
  createdAt: string;
  seasonName: string;
  fromSeason: string;
  toSeason: string;
  isActive: boolean;
}

export interface ISeasonsApiResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: number | null;
    nextPage: number | null;
    lastPage: number | null;
    result: ISeason[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface ICrop {
  id: number;
  createdAt: string;
  image: {
    id: number;
    createdAt: string;
    image: string;
  };
  cropName: string;
  description: string;
  types: Array<{ id: number; createdAt: string; type: string }>;
  seasons: Array<{
    id: number;
    createdAt: string;
    seasonName: string;
    fromSeason: string;
    toSeason: string;
  }>;
}

export interface ICropsApiResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    result: ICrop[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IImage {
  id: number;
  createdAt: string;
  isActive: boolean;
  image: string;
}

export interface IImagesApiResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: string | null;
    nextPage: string | null;
    lastPage: string | null;
    result: IImage[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IUser {
  userId: string;
  createdAt: string;
  isActive: boolean;
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  password: string;
  blocked: boolean;
  provider: string | null;
  blocked_reason: string | null;
  deleted: boolean;
  profile: number | null;
  employeeDetails: any | null;
  expertDetail: any | null;
  role: IRole;
}

export interface IUsersApiResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: string | null;
    nextPage: string | null;
    lastPage: string | null;
    result: IUser[];
  };
}

export interface IProfileApiResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: string | null;
    nextPage: string | null;
    lastPage: string | null;
    result: IProfile[];
  };
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  users: IUser[];
  permissions: IPermission[];
}

export interface IRoleAPIResponse {
  success: boolean;
  data: {
    result: IRole[];
  };
}

export interface IPermission {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  path: string;
  method: RequestMethod;
}

export interface IPermissionAPIResponse {
  success: boolean;
  source: string;
  data: {
    data: IPermission[];
    total: number;
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IImage {
  id: number;
  createdAt: string;
  isActive: boolean;
  image: string;
  name: string;
}

export interface IImageAPIResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: string | null;
    nextPage: string | null;
    lastPage: string | null;
    result: IImage[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IFeaturedImage {
  id: number;
  createdAt: string;
  isActive: boolean;
  image: string;
  name: string;
}

export interface ISlider {
  id: number;
  createdAt: string;
  isActive: boolean;
  title: string;
  description: string;
  featuredImage: IFeaturedImage;
}

export interface ISliderResponse {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: null | string;
    nextPage: null | string;
    lastPage: null | string;
    result: ISlider[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IPublication {
  id: number;
  createdAt: string;
  isActive: boolean;
  featuredImage: IImage | null;
  title: string;
  subTitle: string;
  description: string;
  category: {
    id: number;
    createdAt: string;
    isActive: boolean;
    name: string;
  };
  subCategory: {
    id: number;
    createdAt: string;
    isActive: boolean;
    name: string;
    category: number;
    type: string;
    image: string | null;
  };
}

export interface IPublicationResponse {
  success: boolean;
  source: string;
  data: {
    data: IPublication[];
    total: number;
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface ISubCategory {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  category: number;
  type: string;
  image: number | null;
}

export interface ICategory {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  subCategories: ISubCategory[];
}

export interface INews {
  id: number;
  createdAt: string;
  isActive: boolean;
  title: string;
  description: string;
  image: IImage;
  categories: ICategory[];
  subCategories: ISubCategory[];
}

export interface INewsApiResp {
  success: boolean;
  source: string;
  data: {
    totalCount: number;
    prevPage: string | null;
    nextPage: string | null;
    lastPage: string | null;
    result: INews[];
  };
  timestamp: string;
  message: string;
  status: number;
}

export interface IAddress {
  pradesh: string;
  district: string;
  municipality: string;
  ward: number;
  tole: string;
  landmark: string;
}

export interface ICitizenshipFront {
  id: number;
}

export interface IProfilePicture {
  id: number;
}

export interface ICitizenshipBack {
  id: number;
}

export interface IFarmkersKyc {
  id: number;
  createdAt: string;
  isActive: boolean;
  area: number;
  fertileSoil: number;
  unfertileSoil: number;
  isOnLease: boolean;
  hasRoadAccess: boolean;
  hasTunnelFarming: boolean;
  profile: number;
  approved: boolean;
}

export interface IAgroFirmKyc {
  id: number;
  createdAt: string;
  isActive: boolean;
  firmName: string;
  ward: number;
  address: string;
  pan: number;
  annualInvestment: number;
  annualTransaction: number;
  personalExpenses: number;
  fullTimeEmpoloyees: number;
  parTimeEmployees: number;
  whomeTheySell: string[];
  type: string;
  remarks: null | string;
  images: IImage[];
  profile: number;
}

export interface IProfile {
  address: IAddress;
  temporaryAddress: IAddress;
  id: number;
  firstName: string;
  lastName: string;
  picture: IProfilePicture;
  gender: string;
  dob: string;
  skills: string[];
  education: string[];
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  citizenshipFront: ICitizenshipFront;
  citizenshipBack: ICitizenshipBack;
  farmkersKyc: IFarmkersKyc;
  agroFirmKyc: IAgroFirmKyc[];
}

export interface IProfileAPIResponse {
  success: boolean;
  source: string;
  data: IProfile;
  timestamp: string;
  message: string;
  status: number;
}

export interface INotice {
  id: number;
  createdAt: string;
  isActive: boolean;
  title: string;
  description: string;
}

export interface IFertilizer {
  id: number;
  createdAt: string;
  isActive: boolean;
  name: string;
  nitrogen: number;
  phosphorous: number;
  potassium: number;
  image: IImage;
}

export interface IFarmerKycProfile {
  id: number;
  createdAt: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  picture: string | null;
  gender: string;
  dob: string;
  skills: string[];
  education: string[];
  citizenshipNumber: string;
  citizenshipIssuedDate: string;
  pradesh: string;
  district: string;
  municipality: string;
  ward: number;
  tole: string;
  landmark: string;
  tPradesh: string;
  tDistrict: string;
  tMunicipality: string;
  tWard: number;
  tTole: string;
  tLandmark: string;
  citizenshipFront: number;
  citizenshipBack: number;
  farmersKyc: number;
  phone: string;
}

export interface IFarmerKyc {
  id: number;
  createdAt: string;
  isActive: boolean;
  area: number;
  fertileSoil: number;
  unfertileSoil: number;
  isOnLease: boolean;
  hasRoadAccess: boolean;
  hasTunnelFarming: boolean;
  profile: IFarmerKycProfile | null;
  approved: boolean;
}

interface ProductionDetails {
  mainProduction: number;
  sellingPrice: number;
  gradualCropProduction: number;
  gradualCropSalePrice: number;
}

export interface CostSheetItem {
  id: number;
  createdAt: string;
  isActive: boolean;
  sn: number;
  type: string;
  name: string;
  unitType: string;
  quantity: number;
  rate: number;
  costSheet: number;
}

export interface CostSheet {
  id: number;
  createdAt: string;
  isActive: boolean;
  title: string;
  commodity: number;
  productionDetails: ProductionDetails;
  data: CostSheetItem[];
}
