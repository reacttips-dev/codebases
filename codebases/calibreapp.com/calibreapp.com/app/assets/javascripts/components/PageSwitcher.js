import React, { Suspense } from 'react'
import classnames from 'classnames'
import { Query } from '@apollo/client/react/components'
import { FormattedMessage } from 'react-intl'

import RadioButtonGroup from './RadioButtonGroup'
import { Search } from './Forms'
import Pagination from './Pagination'
import { Flex, Box } from './Grid'
import { ListPagesDeprecated, ListPages } from '../queries/PageQueries.gql'
import { Text } from './Type'
import { ChevronIcon as Chevron } from './Icon'
import truncate from '../utils/smart-truncate'

class PageSwitcher extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pagesFilter: {},
      panelIsOpen: false
    }

    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
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

  handlePageChange(page) {
    this.setState(
      {
        page: page
      },
      () => {
        this.toggleFilterVisibility()
        this.props.onApply.call(this, {
          page: this.state.page
        })
      }
    )
  }

  handleSearch(nameContains) {
    this.setState({ pagesFilter: { nameContains } })
  }

  render() {
    const { orgId, teamId, siteId, selectedPage } = this.props
    const { pagesFilter } = this.state

    const classes = classnames('dropdown', {
      'dropdown--isActive': this.state.panelIsOpen
    })

    return (
      <div className={classes} style={{ display: 'inline-block' }}>
        <button
          className="dropdown__trigger type-semibold type-c-dark-grey"
          onClick={this.toggleFilterVisibility}
          style={{ cursor: 'pointer' }}
        >
          {selectedPage && truncate(selectedPage.name, 25)}
          <div className="dropdown__chevron">
            <Chevron />
          </div>
        </button>

        <div className="dropdown__target">
          <div className="dropdown__header">
            <Search
              placeholder="Search for page"
              onChange={this.handleSearch}
            />
          </div>
          <div className="dropdown__content">
            {this.state.panelIsOpen && (
              <Suspense fallback={<div />}>
                <Query
                  query={teamId ? ListPages : ListPagesDeprecated}
                  variables={{
                    orgId,
                    teamId,
                    siteId,
                    pagesFilter,
                    count: 20
                  }}
                  fetchPolicy="network-only"
                >
                  {({ loading, data, fetchMore }) => {
                    if (loading || !data) return null
                    const site = data?.team?.site || data?.organisation?.site
                    const {
                      pagesList: { edges, pageInfo }
                    } = site

                    const pages = edges.map(edge => {
                      const { canonical, name, uuid, previewImage } = edge.node
                      return {
                        canonical,
                        label: name,
                        value: uuid,
                        previewImage: previewImage ? previewImage.url : null
                      }
                    })

                    const nextPage = () => {
                      fetchMore({
                        variables: {
                          cursor: pageInfo.endCursor
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (teamId) {
                            return Object.assign({}, prev, {
                              team: {
                                ...prev.team,
                                // To get around a bug in @apollo/client and to force a re-render
                                // we update the top level object …
                                bustCache: 1,
                                site: {
                                  ...prev.team.site,
                                  pagesList: {
                                    ...prev.team.site.pagesList,
                                    edges: [
                                      ...prev.team.site.pagesList.edges,
                                      ...fetchMoreResult.team.site.pagesList
                                        .edges
                                    ],
                                    pageInfo:
                                      fetchMoreResult.team.site.pagesList
                                        .pageInfo
                                  }
                                }
                              }
                            })
                          } else {
                            return Object.assign({}, prev, {
                              organisation: {
                                ...prev.organisation,
                                // To get around a bug in @apollo/client and to force a re-render
                                // we update the top level object …
                                bustCache: 1,
                                site: {
                                  ...prev.organisation.site,
                                  pagesList: {
                                    ...prev.organisation.site.pagesList,
                                    edges: [
                                      ...prev.organisation.site.pagesList.edges,
                                      ...fetchMoreResult.organisation.site
                                        .pagesList.edges
                                    ],
                                    pageInfo:
                                      fetchMoreResult.organisation.site
                                        .pagesList.pageInfo
                                  }
                                }
                              }
                            })
                          }
                        }
                      })
                    }

                    return (
                      <div className="dropdown__list">
                        {(pages.length && (
                          <RadioButtonGroup
                            onChange={this.handlePageChange}
                            checked={selectedPage.uuid}
                            items={pages}
                          />
                        )) || (
                          <Flex>
                            <Box px={1}>
                              <Text>
                                <FormattedMessage id="pages.empty" />
                              </Text>
                            </Box>
                          </Flex>
                        )}
                        <Flex>
                          <Box mx="auto">
                            <Pagination pageInfo={pageInfo} onNext={nextPage} />
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

export default PageSwitcher
