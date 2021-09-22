export interface SalesforceIds {
    methodOfContactId: string;
    localeId: string;
    leadDetailsId: string;
    webFirstNameId: string;
    webLastNameId: string;
    webLanguageId: string;
    caseReferenceNumberId: string;
    caseReferenceTypeId: string;
}

export interface BaseFieldMap {
    firstName: string;
    lastName: string;
    company: string;
    locale: string;
    email?: string;
    phone?: string;
    recordType: string;
    oid: string;
}

export interface CaseFieldMap extends BaseFieldMap {
    caseType?: string;
    reason?: string;
    caseRefNo?: string;
    caseRefType?: string;
}

export interface LeadFieldMap extends BaseFieldMap {
    source?: string;
    preference?: string;
}

export const hydrateSalesforceFieldMapByType = (ids: SalesforceIds, isExistingOrder: boolean): CaseFieldMap|LeadFieldMap  => {
    const { webFirstNameId, webLastNameId, webLanguageId, caseReferenceNumberId, caseReferenceTypeId, localeId, methodOfContactId, leadDetailsId } = ids;
    const caseFieldMap = {
        reason: "subject",
        firstName: webFirstNameId,
        lastName: webLastNameId,
        locale: webLanguageId,
        caseType: "type",
        caseRefNo: caseReferenceNumberId,
        caseRefType: caseReferenceTypeId,
        details: "description",
        oid: "orgid",
    };
    const leadFieldMap = {
        locale: localeId,
        oid: "oid",
        lastName: "last_name",
        firstName: "first_name",
        source: "lead_source",
        preference: methodOfContactId,
        details: leadDetailsId,
    };
    return {
        email: "email",
        phone: "phone",
        company: "company",
        recordType: "recordType",
        ...( isExistingOrder ? caseFieldMap : leadFieldMap)
    };
};

export const mapToSalesforceFields = (data: any, acc: {}, fieldName: string, hydratedFieldMap: CaseFieldMap|LeadFieldMap, ) => {
    const callbackTime = data.contactTime ? data.contactTime.value : null;
    if (!hydratedFieldMap[fieldName]) {
        return acc;
    }
    if (fieldName === "details") {
        acc[hydratedFieldMap[fieldName]] =  callbackTime ? `Callback ${callbackTime}. ${data[fieldName].value}` :  data[fieldName].value;
    } else if (fieldName === "reason" && data[fieldName].value === "Existing Order") {
        acc[hydratedFieldMap[fieldName]] = `${data[fieldName].value} Inquiry -  <${data.firstName.value} ${data.lastName.value}>`;
    } else {
        acc[hydratedFieldMap[fieldName]] = data[fieldName].value;
    }
    return acc;
};
