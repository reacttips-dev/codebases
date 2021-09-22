//
// Important:
//
// Following consts are defined as enums in OTEL-OTelJS git repository. Ideally, we should import
// these enums from "@microsoft/oteljs" and use it. But js-test (UT) is running into following
// error at runtime. We are not sure how to resolve this and hence redefining it here
// as consts until we find good solution for it.
// Link:
// https://office.visualstudio.com/OE/_git/OTEL-OTelJS?path=%2Foteljs%2Fsrc%2FDataModels.ts&version=GBv4%2Fmaster&_a=contents
//
// Until that, any changes in enums in oteljs package need to be manually done here.
//

// enum DataCategories values
export const DataCategories_NotSet = 0x00;
export const DataCategories_SoftwareSetup = 0x01;
export const DataCategories_ProductServiceUsage = 0x02;
export const DataCategories_ProductServicePerformance = 0x04;
export const DataCategories_DeviceConfiguration = 0x08;
export const DataCategories_InkingTypingSpeech = 0x10;

// enum DiagnosticLevel values
export const DiagnosticLevel_ReservedDoNotUse = 0;
export const DiagnosticLevel_Required = 10;
export const DiagnosticLevel_Optional = 100;
export const DiagnosticLevel_RequiredServiceData = 110;
export const DiagnosticLevel_RequiredServiceDataForEssentialServices = 120;
