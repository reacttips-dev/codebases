import React from 'react';
import PropTypes from 'prop-types';
import { PaginationStateProps, PaginationStateState } from './__types__';

export default class PaginationState extends React.Component<PaginationStateProps, PaginationStateState> {
  state = {
    page: 0,
    limit: 1,
  };

  static childContextTypes = {
    setPage: PropTypes.func,
    setLimit: PropTypes.func,
    page: PropTypes.number,
    start: PropTypes.number,
    limit: PropTypes.number,
  };

  constructor(props: PaginationStateProps) {
    super(props);
    this.setPage.bind(this);
    this.setLimit.bind(this);

    if (this.props.limit !== undefined) {
      this.state.limit = this.props.limit;
    }

    if (this.props.page !== undefined) {
      this.state.page = this.props.page;
    }
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
  }

  setLimit(n: number) {
    this.setState({ limit: n });
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
