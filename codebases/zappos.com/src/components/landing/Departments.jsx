import Collapsible from 'react-collapsible';
import { Link } from 'react-router';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { ExpandLess, ExpandMore } from 'components/icons';
import { stripSpecialChars } from 'helpers';

import styles from 'styles/components/landing/departments.scss';

export const Departments = ({ slotDetails, onComponentClick, slotIndex }) => {
  const { heading, linkSections, monetateId } = slotDetails;

  const renderDeptName = (name, isOpen) => (
    <span className={styles.departmentName}>
      {name}
      {isOpen ? <ExpandLess size={24} className={styles.expandIcon}/> : <ExpandMore size={24} className={styles.expandIcon}/>}
    </span>
  );

  return (
    <ul className={styles.departments} data-monetate-id={monetateId}>
      <h4 className={styles.departmentHeading}>{heading}</h4>
      {linkSections.map((linkSection, i) => {
        const { headingtext, links } = linkSection;
        const deptHeading = (headingtext) ? headingtext : 'Click to Expand';
        const deptOpenHeading = (headingtext) ? headingtext : 'Click to Hide';
        const testHeadingText = headingtext ? headingtext : '';
        return (
          <li key={`${stripSpecialChars(headingtext)}_${i}`} className={styles.departmentSection}>
            <Collapsible trigger={renderDeptName(deptHeading, false)} triggerWhenOpen={renderDeptName(deptOpenHeading, true)}>
              {links.map((link, j) => {
                const { text, href } = link;
                if (text && href) {
                  return (
                    <p key={`${stripSpecialChars(text)}_${j}`} className={styles.departmentLink}>
                      <Link
                        to={href}
                        onClick={onComponentClick}
                        data-eventlabel="Departments"
                        data-slotindex={slotIndex}
                        data-eventvalue={`${testHeadingText}-${text}`}>
                        {text}
                      </Link>
                    </p>
                  );
                }
              })}
            </Collapsible>
          </li>
        );
      })}
    </ul>
  );
};

export default withErrorBoundary('Departments', Departments);
