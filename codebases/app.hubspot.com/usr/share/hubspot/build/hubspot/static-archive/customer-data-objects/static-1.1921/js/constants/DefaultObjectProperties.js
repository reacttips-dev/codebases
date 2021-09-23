'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _fromJS;

import { fromJS } from 'immutable';
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
export default fromJS((_fromJS = {}, _defineProperty(_fromJS, ObjectTypes.CONTACT, {
  email: {
    required: false,
    disabled: {
      removal: true,
      required: false
    }
  },
  firstname: {
    required: false,
    disabled: {
      removal: true,
      required: false
    }
  },
  lastname: {
    required: false,
    disabled: {
      removal: true,
      required: false
    }
  },
  hubspot_owner_id: {
    required: false
  },
  jobtitle: {
    required: false
  }
}), _defineProperty(_fromJS, ObjectTypes.COMPANY, {
  domain: {
    required: false,
    disabled: {
      removal: true,
      required: false
    }
  },
  name: {
    required: false,
    disabled: {
      removal: true,
      required: false
    }
  },
  hubspot_owner_id: {
    required: false
  }
}), _defineProperty(_fromJS, ObjectTypes.DEAL, {
  dealname: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  pipeline: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  dealstage: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  amount: {
    required: false
  },
  deal_currency_code: {
    required: false
  },
  closedate: {
    required: false
  },
  hubspot_owner_id: {
    required: false
  }
}), _defineProperty(_fromJS, ObjectTypes.TICKET, {
  subject: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  hs_pipeline: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  hs_pipeline_stage: {
    required: true,
    disabled: {
      removal: true,
      required: true
    }
  },
  content: {
    required: false
  },
  source_type: {
    required: false
  },
  hubspot_owner_id: {
    required: false
  },
  hs_ticket_priority: {
    required: false
  }
}), _fromJS));