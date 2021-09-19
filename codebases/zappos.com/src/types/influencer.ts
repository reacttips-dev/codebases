import { EmptyObject } from 'types/utility';

// corresponding mapping present at: https://code.amazon.com/packages/ZapposInfluencerServiceARestInterface/blobs/mainline/--/src/com/amazon/zapposinfluencerservicearest/model/SocialMediaProfileType.java
export enum ProfileType {
  INSTAGRAM = 'Instagram',
  YOUTUBE = 'Youtube',
  FACEBOOK = 'Facebook',
  TIKTOK = 'TikTok',
}
export enum ProfileValidationStatus {
  PENDING = 'PendingValidation',
  VALIDATED = 'Validated'
}
export enum InfluencerStatus {
  ACTIVE='Active',
  PENDING='Pending',
  NULL ='null',
  UNKNOWN = 'UNKNOWN'
}

export interface SocialMediaProfile {
  profileIdentifier: string;
  profileName: string ;
  profileType: ProfileType;
  profileUrl: string;
  validationStatus: ProfileValidationStatus ;
  createdAt: number;
  updatedAt: number;
}

export interface SocialMediaProfileRequestBody {
  profileName?: String;
  profileType: String;
  profileIdentifier?: String;
  oAuthCode: String;
  refreshToken?: String;
  tokenExpirationDate?: String;
  oAuthScope?: String;
  profileUrl?: String;
}

export interface InfluencerAppConfig {
  facebookClientAppId: string;
  InstagramClientAppId: string;
  googleClientAppId: string;
  TikTokClientAppId: string;
}

export interface InfluencerState {
  status: InfluencerStatus;
  socialMediaProfiles: EmptyObject;
  name: string;
  isLoading: boolean;
  isInfluencer: boolean;
  influencerToken: string;
  appConfig: InfluencerAppConfig;
}
