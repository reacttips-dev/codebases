import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

type Birthday = {
  day: number;
  month: number;
  year: number;
};

type Phone = {
  countryCode?: string;
  phoneNumber?: string;
  extension?: string;
};

type Location = {
  city: string;
  country: string;
  state: string;
  freeform: string;
  lat?: number;
  lng?: number;
};

type Photos = {
  default: string;
  size24: string;
  size60: string;
  size120: string;
};

type Websites = {
  default: string;
  facebook: string;
  github: string;
  gplus: string;
  linkedin: string;
  twitter: string;
};

type Definition = {
  id?: string;
  name?: string;
};

export type Industry = {
  definition: Definition;
  typeName: string;
};

export type Occupation = {
  definition: Definition;
  typeName: string;
};

type InterestedCareer = {
  industry?: Industry;
  occupation?: Occupation;
  occupationLevel?: number;
};

type UserInterestedSkill = {
  definition: string;
  typeName: string;
};

type UserGeneratedSkill = {
  definition: { name: string };
  typeName: string;
};

export enum CAREER_GOAL {
  changeCareer = 1,
  improveSkill = 2,
}

type Demographics = {
  currentIndustry?: Industry;
  currentOccupation?: Occupation;
  currentOccupationLevel?: number;
  educationalAttainment?: number;
  educationMajor?: number;
  currentOrLatestSchool?: { name: string };
  employer?: string;
  employmentStatus?: number;
  interestedCareers?: Array<InterestedCareer>;
  interestedLocations?: Array<Location>;
  lookingForNewJob?: boolean;
  studentStatus?: number;
  skillsPossessed?: Array<UserInterestedSkill | UserGeneratedSkill>;
  skillsWanted?: Array<UserInterestedSkill | UserGeneratedSkill>;
  // using this temporarily before migrating to core skills api
  skillsWantedV2?: Array<UserInterestedSkill | UserGeneratedSkill>;
  isCurrentStudent?: boolean;
  isCurrentEmployer?: boolean;
  learningGoal?: CAREER_GOAL;
  haveTakenOnlineCourse?: boolean;
  learningProgramInterest?: Array<number>;
  haveInterestInTrainingTeam?: boolean;
};

type IndividualPrivacySettings = {
  bioPrivacy: number;
  birthdayPrivacy: number;
  currentIndustryPrivacy: number;
  currentOccupationLevelPrivacy: number;
  currentOccupationPrivacy: number;
  educationalAttainmentPrivacy: number;
  employerPrivacy: number;
  employmentStatusPrivacy: number;
  genderPrivacy: number;
  interestedCareersPrivacy: number;
  interestedLocationsPrivacy: number;
  locationPrivacy: number;
  lookingForNewJobPrivacy: number;
  studentStatusPrivacy: number;
  websitesPrivacy: number;
};

class Profile extends NaptimeResource {
  static RESOURCE_NAME = 'profiles.v1';

  id!: string;

  userId!: number;

  fullName?: string;

  externalId!: string;

  privacy!: number;

  gender?: number;

  birthday?: Birthday;

  phone?: Phone;

  locale?: string;

  location!: Location;

  photos?: Photos;

  websites?: Websites;

  bio?: string;

  timezone?: string;

  identityVerified?: boolean;

  demographics!: Demographics;

  individualPrivacySettings?: IndividualPrivacySettings;

  /**
   * Useful to get initials from learner's fullName
   * @return {String} Initials from name
   */
  @requireFields('fullName')
  getInitials(): string | undefined {
    return (
      this.fullName &&
      this.fullName
        .split(' ')
        .map((s) => s.charAt(0))
        .join('')
        .toUpperCase()
    );
  }

  /**
   * Check is can show user's profile pic based on privacy settings and availability
   * @return {bool} If ok to show learner profile pic
   */
  @requireFields('photos')
  canShowProfilePic(): boolean {
    return (this.photos && this.photos.default && this.privacy >= 10) || false;
  }

  @requireFields('location')
  get locationCountry(): string | undefined {
    return this.location && this.location.country;
  }

  @requireFields('demographics')
  get studentStatus(): number | undefined {
    return this.demographics && this.demographics.studentStatus;
  }

  // Introduction
  @requireFields('photos')
  get photosDefault(): string | undefined {
    return this.photos && this.photos.default;
  }

  @requireFields('photos')
  get photosSize24(): string | undefined {
    return this.photos && this.photos.size24;
  }

  @requireFields('photos')
  get photosSize60(): string | undefined {
    return this.photos && this.photos.size60;
  }

  @requireFields('photos')
  get photosSize120(): string | undefined {
    return this.photos && this.photos.size120;
  }

  @requireFields('location')
  get locationFreeform(): string {
    return this.location && this.location.freeform;
  }

  @requireFields('websites')
  get websitesLinkedin(): string | undefined {
    return this.websites && this.websites.linkedin;
  }

  @requireFields('websites')
  get websitesFacebook(): string | undefined {
    return this.websites && this.websites.facebook;
  }

  @requireFields('websites')
  get websitesTwitter(): string | undefined {
    return this.websites && this.websites.twitter;
  }

  @requireFields('websites')
  get websitesGplus(): string | undefined {
    return this.websites && this.websites.gplus;
  }

  @requireFields('websites')
  get websitesGithub(): string | undefined {
    return this.websites && this.websites.github;
  }

  @requireFields('websites')
  get websitesDefault(): string | undefined {
    return this.websites && this.websites.default;
  }

  @requireFields('birthday')
  get birthdayDay(): number | undefined {
    return this.birthday && this.birthday.day;
  }

  @requireFields('birthday')
  get birthdayMonth(): number | undefined {
    return this.birthday && this.birthday.month;
  }

  @requireFields('birthday')
  get birthdayYear(): number | undefined {
    return this.birthday && this.birthday.year;
  }

  @requireFields('demographics')
  get skillsPossessed(): Array<UserInterestedSkill | UserGeneratedSkill> | undefined {
    return this.demographics && this.demographics.skillsPossessed;
  }

  // Experience
  @requireFields('demographics')
  get employmentStatus(): number | undefined {
    return this.demographics && this.demographics.employmentStatus;
  }

  @requireFields('demographics')
  get employer(): string | undefined {
    return this.demographics && this.demographics.employer;
  }

  @requireFields('demographics')
  get currentOccupation(): Occupation | undefined {
    return this.demographics && this.demographics.currentOccupation;
  }

  @requireFields('demographics')
  get currentOccupationLevel(): number | undefined {
    return this.demographics && this.demographics.currentOccupationLevel;
  }

  @requireFields('demographics')
  get educationalAttainment(): number | undefined {
    return this.demographics && this.demographics.educationalAttainment;
  }

  // Career
  @requireFields('demographics')
  get lookingForNewJob(): boolean | undefined {
    return (this.demographics && this.demographics.lookingForNewJob) || false;
  }

  @requireFields('demographics')
  get skillsWanted(): Array<UserInterestedSkill | UserGeneratedSkill> | undefined {
    return this.demographics && this.demographics.skillsWanted;
  }
}

export default Profile;
