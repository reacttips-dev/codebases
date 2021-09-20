import React, { Component } from 'react';
import classnames from 'classnames';
import UpSolidIcon from './Icons/UpSolidIcon';

export default class SortableTable extends Component {
  constructor (props) {
    super(props);

    this.state = { sort: 'asc' };

    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.getSortedRows = this.getSortedRows.bind(this);
  }

  handleChangeSort () {
    this.setState((state) => {
      return { sort: state.sort === 'asc' ? 'desc' : 'asc' };
    });
  }

  getSortedRows () {
    return _.sortBy(this.props.rows, (row) => _.toLower(_.get(row, this.props.rowKey, '')));
  }

  getClasses () {
    return classnames({ 'sortable-table': true }, this.props.className);
  }

  getSortClasses () {
    return classnames({
      'sortable-table__header__sort': true,
      'sortable-table__header__sort--desc': this.state.sort === 'desc',
      'sortable-table__header__sort--asc': this.state.sort === 'asc'
    });
  }

  render () {
    let sortedRows = this.getSortedRows();
    if (this.state.sort === 'desc') {
      _.reverse(sortedRows);
    }

    return (
      <div className={this.getClasses()}>
        <div className='sortable-table__header'>
          <div className='sortable-table__header__title'>{ this.props.header }</div>
          <UpSolidIcon
            className={this.getSortClasses()}
            size='xs'
            onClick={this.handleChangeSort}
          />
        </div>
        <div className='sortable-table__rows'>
          {
            _.map(sortedRows, (row, index) => {
              return (
                <div
                  className='sortable-table__row'
                  key={index}
                >
                  {
                    this.props.rowRenderer ?
                      this.props.rowRenderer(row) :
                       _.get(row, this.props.rowKey, '')
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
