export enum ContactsFiltersType {
    ROLES = "roles",
    DEPARTMENTS = "departments",
    COUNTRIES = "countries",
    SENIORITY_LEVELS = "seniorityLevels",
}

export enum ContactsSearchType {
    TITLES = "titles",
    EXCLUDE_TITLES = "excludetitles",
}

export type ContactsFilterBase = {
    id: string;
    text: string;
};

export type ContactsFilterResponse = {
    id: number;
    text: string;
};

export type ContactsFilters = {
    roles: ContactsFilterBase[];
    departments: ContactsFilterBase[];
    countries: ContactsFilterBase[];
    seniorityLevels: ContactsFilterBase[];
};

export type ContactsFiltersParams = {
    roles?: string[];
    departments?: ContactsDepartments[];
    countries?: string[];
    seniorityLevels?: string[];
};

export type ContactsFiltersResponse = {
    roles: ContactsFilterResponse[];
    departments: ContactsFilterResponse[];
    countries: ContactsFilterResponse[];
    seniorityLevels: ContactsFilterResponse[];
};

export type PhoneNumberType = "FIXED_LINE" | "MOBILE" | "FIXED_LINE_OR_MOBILE" | "TOLL_FREE";

export type PhoneNumber = {
    number: string;
    type?: string;
    numberType: PhoneNumberType;
};

export type Contact = {
    isPrivateDataUnlocked: boolean;
    contactId: string;
    fullName: string;
    jobTitle?: string;
    imageUrl?: string;
    seniority?: string;
    role?: string;
    department?: string;
    departments?: string;
    country?: string;
    phoneNumbers?: PhoneNumber[];
    linkedInUrl?: string;
    emails?: string[];
};

export type ContactsQuota = {
    isFeatureLocked: boolean;
    remaining: number;
    total: number;
    used: number;
};

export type ContactsResponse = {
    contacts: Contact[];
    totalCount: number;
};

export type ContactsDetailsResponse = {
    emails: string[];
    phoneNumbers: PhoneNumber[];
    quota: ContactsQuota;
};

export type ContactsSearchParams = {
    titles?: string[];
    excludetitles?: string[]; // ask rename on BE;
};

export type ContactsParams = ContactsFiltersParams &
    ContactsSearchParams & {
        pageSize?: number;
        page?: number;
    };

export type ContactsDepartments =
    | "ACCOUNTING"
    | "BUSINESS"
    | "CLIENT SUCCESS"
    | "HR"
    | "LEADERSHIP"
    | "LEGAL"
    | "MARKETING"
    | "OPERATIONS"
    | "OVERSIGHT"
    | "PRODUCTION"
    | "SALES"
    | "TECHNOLOGY";
