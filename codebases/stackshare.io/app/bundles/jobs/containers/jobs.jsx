import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {SigninDesktopModal} from '../../../shared/library/modals/signin';
import {PAGE_BACKGROUND} from '../../../shared/style/colors';
import {PAGE_WIDTH} from '../../../shared/style/dimensions';
import Sidebar from '../components/sidebar';
import SearchBar from '../components/search-bar';
import AltHeader from '../components/alt-header';
import JobList from '../components/job-list';
import JobsNotice from '../components/notice';
import {withAnalyticsPayload} from '../../../shared/enhancers/analytics-enhancer';
import {compose} from 'react-apollo';
import {JobsContext} from '../enhancers/jobs';

const Page = glamorous.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: PAGE_BACKGROUND,
  minHeight: '100vh',
  position: 'relative'
});

const Main = glamorous.main({
  gridArea: 'content',
  display: 'flex',
  flexDirection: 'column',
  padding: '30px 0px 130px 30px'
});

const Grid = glamorous.div({
  position: 'relative',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: `auto 312px ${PAGE_WIDTH - 312}px auto`,
  gridTemplateRows: 'minmax(95px, auto) auto',
  gridTemplateAreas: `
    ". sidebar searchBar     searchBar"
    ". sidebar content .  "
  `
});

const Jobs = ({signin}) => {
  const jobsContext = useContext(JobsContext);
  return (
    <Page>
      <Grid>
        <Sidebar />
        {!jobsContext.bookmarkSearch && <SearchBar />}
        {jobsContext.bookmarkSearch && <AltHeader />}
        <Main>
          <JobsNotice />
          <JobList />
        </Main>
      </Grid>
      {signin && <SigninDesktopModal redirect={'/jobs'} />}
    </Page>
  );
};

Jobs.propTypes = {
  signin: PropTypes.bool
};

export default compose(
  withAnalyticsPayload({
    'page.name': 'Jobs',
    path: typeof window !== 'undefined' ? window.location.pathname : null,
    url: typeof window !== 'undefined' ? window.location.href : null,
    referrer: typeof document !== 'undefined' ? document.referrer : null
  })
)(Jobs);
