'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _objectRecords;

import * as objectTypes from 'customer-data-objects/constants/ObjectTypes';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import QuoteRecord from 'customer-data-objects/quote/QuoteRecord';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
export var objectRecords = (_objectRecords = {}, _defineProperty(_objectRecords, objectTypes.CONTACT, ContactRecord), _defineProperty(_objectRecords, objectTypes.COMPANY, CompanyRecord), _defineProperty(_objectRecords, objectTypes.TICKET, TicketRecord), _defineProperty(_objectRecords, objectTypes.DEAL, DealRecord), _defineProperty(_objectRecords, objectTypes.QUOTE, QuoteRecord), _defineProperty(_objectRecords, objectTypes.TASK, TaskRecord), _objectRecords);