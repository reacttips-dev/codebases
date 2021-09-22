import Get from './Get';
import LocalGet from './LocalGet';
import LocalMultiGet from './LocalMultiGet';
import MultiGet from './MultiGet';
import GetAll from './GetAll';
import Finder from './Finder';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Action from './Action';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Create from './Create';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Update from './Update';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Delete from './Delete';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Patch from './Patch';

const exported = {
  Get,
  LocalGet,
  LocalMultiGet,
  MultiGet,
  GetAll,
  Finder,
  Action,
  Create,
  Update,
  Delete,
  Patch,
};

export default exported;
export { Get, LocalGet, LocalMultiGet, MultiGet, GetAll, Finder, Action, Create, Update, Delete, Patch };
