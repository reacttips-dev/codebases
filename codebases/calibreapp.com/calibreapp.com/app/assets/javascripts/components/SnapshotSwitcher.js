import React, { Suspense } from 'react'
import classnames from 'classnames'
import { Query } from '@apollo/client/react/components'
import { FormattedMessage } from 'react-intl'

import RadioButtonGroup from './RadioButtonGroup'
import { Search } from './Forms'
import Pagination from './Pagination'
import { Flex, Box } from './Grid'
import { ListSnapshots } from '../queries/SnapshotQueries.gql'
import { Text } from './Type'
import { ChevronIcon as Chevron } from './Icon'

class SnapshotSwitcher extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      snapshotsFilter: {},
      panelIsOpen: false
    }

    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this)
    this.handleSnapshotChange = this.handleSnapshotChange.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount() {
    document.body.addEventListener('click', this.closeMenu, false)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closeMenu)
  }

  closeMenu(event) {
    let els = []
    let element = event.target
    while (element.parentNode) {
      els.unshift(element.parentNode)
      element = element.parentNode
    }

    const withinDropdown = els.reverse().some(el => {
      if (el.classList) return el.classList.contains('dropdown')
    })

    if (!withinDropdown) this.setState({ panelIsOpen: false })
  }

  toggleFilterVisibility() {
    this.setState({
      panelIsOpen: !this.state.panelIsOpen
    })
  }

  handleSnapshotChange(snapshotId) {
    this.setState(
      {
        snapshotId
      },
      () => {
        this.toggleFilterVisibility()
        this.props.onApply.call(this, {
          snapshotId: this.state.snapshotId
        })
      }
    )
  }

  handleSearch(value) {
    let iid = null
    const regex = /[+-]?\d+(?:\.\d+)?/g
    const match = regex.exec(value)
    if (match && match.length) {
      iid = Number(match[0])
    }
    this.setState({ snapshotsFilter: { iid } })
  }

  render() {
    const { teamId, siteId, selectedSnapshot } = this.props
    const { snapshotsFilter } = this.state

    const classes = classnames('dropdown', {
      'dropdown--isActive': this.state.panelIsOpen
    })

    return (
      <div className={classes} style={{ display: 'inline-block' }}>
        <button
          className="dropdown__trigger type-semibold type-c-dark-grey  p--l0"
          onClick={this.toggleFilterVisibility}
          style={{ cursor: 'pointer' }}
        >
          {!selectedSnapshot || `Snapshot #${selectedSnapshot.iid}`}
          <div className="dropdown__chevron">
            <Chevron />
          </div>
        </button>

        <div className="dropdown__target">
          <div className="dropdown__header">
            <Search
              placeholder="Search for snapshot"
              onChange={this.handleSearch}
            />
          </div>
          <div className="dropdown__content">
            {this.state.panelIsOpen && (
              <Suspense fallback={<div />}>
                <Query
                  query={ListSnapshots}
                  variables={{
                    teamId,
                    siteId,
                    snapshotsFilter
                  }}
                  fetchPolicy="network-only"
                >
                  {({ loading, data, fetchMore }) => {
                    if (loading || !data) return null

                    let {
                      team: {
                        site: {
                          snapshotsList: { edges, pageInfo }
                        }
                      }
                    } = data
                    const snapshots = edges.map(edge => {
                      const { iid } = edge.node
                      return {
                        label: `Snapshot #${iid}`,
                        value: iid
                      }
                    })

                    const nextSnapshot = () => {
                      fetchMore({
                        variables: {
                          cursor: pageInfo.endCursor
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          return Object.assign({}, prev, {
                            team: {
                              ...prev.team,
                              // To get around a bug in @apollo/client and to force a re-render
                              // we update the top level object …
                              bustCache: 1,
                              site: {
                                ...prev.team.site,
                                snapshotsList: {
                                  ...prev.team.site.snapshotsList,
                                  edges: [
                                    ...prev.team.site.snapshotsList.edges,
                                    ...fetchMoreResult.team.site.snapshotsList
                                      .edges
                                  ],
                                  pageInfo:
                                    fetchMoreResult.team.site.snapshotsList
                                      .pageInfo
                                }
                              }
                            }
                          })
                        }
                      })
                    }

                    return (
                      <div className="dropdown__list">
                        {(snapshots.length && (
                          <RadioButtonGroup
                            onChange={this.handleSnapshotChange}
                            checked={selectedSnapshot.iid}
                            items={snapshots}
                          />
                        )) || (
                          <Flex>
                            <Box px={1}>
                              <Text>
                                <FormattedMessage id="snapshots.empty" />
                              </Text>
                            </Box>
                          </Flex>
                        )}
                        <Flex>
                          <Box mx="auto">
                            <Pagination
                              pageInfo={pageInfo}
                              onNext={nextSnapshot}
                            />
                          </Box>
                        </Flex>
                      </div>
                    )
                  }}
                </Query>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default SnapshotSwitcher
