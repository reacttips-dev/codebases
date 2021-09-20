import ClassroomNav from './_nav';
import { EnterpriseConsumer } from 'components/common/enterprise-context';
import { ExternalServiceConsumer } from 'components/common/external-service-context';
import PropTypes from 'prop-types';

export default function ClassroomNavContainer(
  { variant, isHelpSidebarOpen, onToggleHelpSidebar },
  { root }
) {
  return (
    <ExternalServiceConsumer>
      {({}) => {
        return (
          <EnterpriseConsumer>
            {({ isEnterprise }) => {
              return (
                <ClassroomNav
                  root={root}
                  variant={variant}
                  isHelpSidebarOpen={isHelpSidebarOpen}
                  onToggleHelpSidebar={onToggleHelpSidebar}
                  isEnterprise={isEnterprise}
                />
              );
            }}
          </EnterpriseConsumer>
        );
      }}
    </ExternalServiceConsumer>
  );
}

ClassroomNavContainer.propTypes = {
  variant: PropTypes.oneOf(['small', 'large', 'dashboard']),
  isHelpSidebarOpen: PropTypes.bool,
  onToggleHelpSidebar: PropTypes.func,
};

ClassroomNavContainer.contextTypes = {
  root: PropTypes.object,
};
