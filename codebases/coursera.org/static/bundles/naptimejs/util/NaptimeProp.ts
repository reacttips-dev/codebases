export type PagingObject = {
  // String that points to a number
  next?: string;
  total: number;
};

type NaptimePropPagingProperty = {
  [naptimePropName: string]: PagingObject;
};

type NaptimePropOptions = {
  paging?: NaptimePropPagingProperty;
};

class NaptimeProp {
  paging: NaptimePropPagingProperty;

  constructor(options: NaptimePropOptions = {}) {
    this.paging = Object.assign({}, options.paging);
  }

  getPagingFor(naptimePropName: string): PagingObject {
    return this.paging[naptimePropName] || { total: 0 };
  }
}

export default NaptimeProp;
