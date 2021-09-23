'use es6';

import CompanyType from './CompanyType';
import ContactType from './ContactType';
import DealType from './DealType';
import FeedbackSubmissionType from './FeedbackSubmissionType';
import PropTypes from 'prop-types';
import VisitType from './VisitType';
import TicketType from './TicketType';
import TaskType from './TaskType';
import EngagementType from './EngagementType';
import QuoteType from './QuoteType';
var SubjectType = PropTypes.oneOfType([CompanyType.isRequired, ContactType.isRequired, DealType.isRequired, FeedbackSubmissionType.isRequired, VisitType.isRequired, TicketType.isRequired, EngagementType.isRequired, TaskType.isRequired, QuoteType.isRequired]);
export default SubjectType;