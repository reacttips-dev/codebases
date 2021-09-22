import React from 'react';
import PropTypes from 'prop-types';
import connectToRouter from 'js/lib/connectToRouter';
import _ from 'underscore';
import { PaginationStateProps, PaginationStateState } from './__types__';

type WithRouter = {
  router: any;
  routerParamPage: string;
  routerParamLimit: string;
};

type PaginationStatePropsWithRouter = PaginationStateProps & WithRouter;

const isNumberString = (val: string) => {
  const valAsNumber = Number(val);
  return !isNaN(valAsNumber);
};

export class PaginationState extends React.Component<PaginationStatePropsWithRouter, PaginationStateState> {
  state = {
    page: 1,
    limit: 1,
  };

  static childContextTypes = {
    setPage: PropTypes.func,
    setLimit: PropTypes.func,
    page: PropTypes.number,
    start: PropTypes.number,
    limit: PropTypes.number,
  };

  sanitizeRouterInput = (numberString: string): number | undefined => {
    return isNumberString(numberString) ? Number(numberString) : undefined;
  };

  constructor(props: PaginationStatePropsWithRouter) {
    super(props);
    this.setPage.bind(this);
    this.setLimit.bind(this);

    const routerLimitNumber = this.sanitizeRouterInput(this.props.router?.location?.query[this.props.routerParamLimit]);
    this.state.limit = routerLimitNumber || this.props.initialLimit || this.state.limit;

    const routerPageNumber = this.sanitizeRouterInput(this.props.router?.location?.query[this.props.routerParamPage]);
    this.state.page = routerPageNumber || this.props.initialPage || this.state.page;
  }

  getChildContext() {
    return {
      page: this.state.page,
      limit: this.state.limit,
      setPage: this.setPage.bind(this),
      setLimit: this.setLimit.bind(this),
    };
  }

  setPage(n: number) {
    this.setState({ page: n });
    this.props.router.push({
      pathname: this.props.router.location.pathname,
      params: this.props.router.params,
      query: Object.assign(this.props.router.location.query, { [this.props.routerParamPage]: n }),
    });
  }

  setLimit(n: number) {
    this.setState({ limit: n });
    this.props.router.push({
      pathname: this.props.router.location.pathname,
      params: this.props.router.params,
      query: Object.assign(this.props.router.location.query, { [this.props.routerParamLimit]: n }),
    });
  }

  render() {
    if (this.props.children && typeof this.props.children === 'function') {
      return this.props.children({
        page: this.context.page,
        limit: this.context.limit,
        setPage: this.context.setPage,
        setLimit: this.context.setLimit,
      });
    }
    return <div>{this.props.children}</div>;
  }
}

export class PaginationStateConsumer extends React.Component {
  static contextTypes = {
    setPage: PropTypes.func.isRequired,
    setLimit: PropTypes.func.isRequired,
    page: PropTypes.number,
    limit: PropTypes.number,
  };

  render() {
    if (this.props.children && typeof this.props.children === 'function') {
      return this.props.children({
        page: this.context.page,
        limit: this.context.limit,
        setPage: this.context.setPage,
        setLimit: this.context.setLimit,
      });
    }
    return <div>{this.props.children}</div>;
  }
}
export default _.compose(
  connectToRouter((router, props) => {
    return {
      router,
      ...props,
    };
  })
)(PaginationState);
