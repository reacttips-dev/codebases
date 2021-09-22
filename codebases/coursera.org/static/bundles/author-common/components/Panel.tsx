// TODO (jcheung) refactor with Panel to centralize logic
// - bundles/author-common/components/CollapsablePanel
// - bundles/author-common/components/ExpandableItem

/** @jsx jsx */
import React from 'react';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import { css, jsx } from '@emotion/react';
import initBem from 'js/lib/bem';

import type { Theme } from '@coursera/cds-core';
import { withTheme } from '@coursera/cds-core';
import { SvgButton, color } from '@coursera/coursera-ui';
import {
  SvgCheck,
  SvgChevronUp,
  SvgChevronDown,
  SvgEdit,
  SvgTrash,
  SvgWindows,
  SvgError,
} from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/author-assignment';
import 'css!./__styles__/Panel';

const ICON_SIZE = 18;
const bem = initBem('Panel');

const styles = {
  root: (hoverBorderColor: string | undefined) =>
    hoverBorderColor &&
    css({
      ':hover': { border: `1px solid ${hoverBorderColor}` },
    }),
  header: (theme: Theme, isCollapsed: boolean, horizontalPadding: number, headerBgColor: string, hasErrors: boolean) =>
    css({
      width: '100%',
      padding: `12px ${horizontalPadding}px`,
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'left',
      borderBottom: isCollapsed ? 'none' : `1px solid ${color.divider}`,
      backgroundColor: hasErrors ? theme.palette.red[100] : headerBgColor,
    }),
  content: (isCollapsed: boolean, horizontalPadding: number, disableContentPadding: boolean) =>
    css({
      padding: `24px ${horizontalPadding}px`,
      ...(disableContentPadding && { padding: 0 }),
      borderTop: 0,
      ...(isCollapsed && { height: 0, padding: 0, overflow: 'hidden' }),
    }),
  draggableIcon: (isHovered: boolean) =>
    css({
      display: isHovered ? 'initial' : 'none',
      cursor: 'grab',
      marginLeft: '-20px',
      marginRight: '4px',
      marginBottom: '-6.5px',
      svg: {
        marginRight: 0,
      },
    }),
};
type RenderPropsFunction = (x: {
  isEditing: boolean;
  toggleEdit: () => void;
  setEditState: (state: boolean) => void;
  setCollapseState: (state: boolean) => void;
}) => React.ReactNode;

type Props = {
  id?: string;
  className?: string;
  /**
   * Bold part of title
   */
  title?: React.ReactNode;
  /**
   * Non-bold part of title.
   * Note: You can pass array of elements to render them with separator "Subtitle 1 | Subtitle 2"
   */
  subtitle?: React.ReactNode;
  collapsibleIconTitle?: string;
  isCollapsible?: boolean;
  startCollapsed?: boolean;
  /**
   * Default 18
   */
  iconSize?: number;
  copyHandler?: () => void;
  deleteHandler?: () => void;
  /**
   * Editable Panel have "Edit" button. You should use function children to access `isEditing`
   * mode and `toggleEdit` function.
   */
  isEditable?: boolean;
  children?: RenderPropsFunction | React.ReactNode;
  /**
   * Does not have header, just content box. Useful to be used as a child panel
   * inside composite Panel.
   */
  isHeadless?: boolean;
  disableContentPadding?: boolean;
  horizontalPadding?: number; // px; amount of base horizontal padding to use for layout
  /**
   * Does not render outside border around panel.  Useful for an inline panel within a parent container.
   */
  isBorderless?: boolean;
  headerBgColor?: string;
  hoverBorderColor?: string;
  /**
   * Draggable icon that's rendered on hover if panel can be dragged.
   */
  draggableIcon?: React.ReactNode;
  hasErrors?: boolean;
  theme: Theme;
  forwardedRef?: React.RefObject<HTMLDivElement> | null;
};

type State = {
  isCollapsed: boolean;
  isEditing: boolean;
  isHovered: boolean;
};

const isRenderPropsFunction = (children: Props['children']): children is RenderPropsFunction =>
  typeof children === 'function';

export class PanelCore extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isCollapsed: props.startCollapsed || false,
      isEditing: false,
      isHovered: false,
    };
  }

  toggleEdit = () => {
    const { isEditable } = this.props;
    if (isEditable) {
      this.setState(({ isEditing }) => ({ isEditing: !isEditing }));
    }
  };

  // TODO (jahuang): this would be much easier to extract if this were a FC
  setEditState = (state: boolean) => {
    const { isEditable } = this.props;
    if (isEditable) {
      this.setState({ isEditing: state });
    }
  };

  togglePanel = () => {
    const { isCollapsible } = this.props;
    if (isCollapsible) {
      this.setState(({ isCollapsed }) => ({ isCollapsed: !isCollapsed }));
    }
  };

  setCollapseState = (state: boolean) => {
    const { isCollapsible } = this.props;
    if (isCollapsible) {
      this.setState({ isCollapsed: state });
    }
  };

  disableDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { isCollapsible } = this.props;
    if (isCollapsible) {
      e.preventDefault();
    }
  };

  handleMouseEnter = () => {
    this.setState({
      isHovered: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      isHovered: false,
    });
  };

  render() {
    const {
      id,
      className,
      title,
      children,
      isCollapsible = false,
      collapsibleIconTitle,
      iconSize = ICON_SIZE,
      isEditable = false,
      copyHandler,
      deleteHandler,
      subtitle,
      isHeadless = false,
      isBorderless = false,
      horizontalPadding = 24,
      disableContentPadding = false,
      headerBgColor = color.white,
      hoverBorderColor,
      draggableIcon,
      hasErrors = false,
      theme,
      forwardedRef,
    } = this.props;

    const { isCollapsed: isCollapsedState, isEditing, isHovered } = this.state;
    const { toggleEdit, setEditState, setCollapseState } = this;
    // Auto expand when we click edit button
    const isCollapsed = isCollapsedState && !isEditing;

    const collapseIcon = isCollapsed ? (
      <SvgChevronDown title={collapsibleIconTitle} size={iconSize} />
    ) : (
      <SvgChevronUp title={collapsibleIconTitle} size={iconSize} />
    );

    const editIcon = isEditing ? (
      <SvgCheck title={_t('Done Editing')} size={iconSize} />
    ) : (
      <SvgEdit title={_t('Edit')} size={iconSize} />
    );

    const hasHeader = !isHeadless && (title || subtitle || isCollapsible || copyHandler || deleteHandler || isEditable);
    const hasSubtitle = !!subtitle;
    return (
      <div
        id={id}
        className={bem(undefined, { isCollapsed, isBorderless }, className)}
        css={styles.root(hoverBorderColor)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={forwardedRef}
      >
        {hasHeader && (
          <div css={styles.header(theme, isCollapsed, horizontalPadding, headerBgColor, hasErrors)}>
            <CdsMigrationTypography
              variant="body1"
              component="h3"
              className={bem('titleContainer', { isCollapsible })}
              cuiComponentName="View"
              onClick={this.togglePanel}
              onMouseDown={this.disableDoubleClick}
            >
              {draggableIcon && <div css={styles.draggableIcon(isHovered)}>{draggableIcon}</div>}
              {hasErrors && <SvgError size={18} color={color.danger} style={{ marginRight: '8px' }} />}
              {title && <div className={bem('title', { fitWidth: hasSubtitle })}>{title}</div>}
              {React.Children.map(subtitle, (s) => (
                <div className={bem('subtitle')}>{s}</div>
              ))}
            </CdsMigrationTypography>
            <div className={bem('buttons')}>
              {copyHandler && (
                <SvgButton
                  rootClassName={bem('button', 'copy')}
                  type="icon"
                  size="zero"
                  svgElement={<SvgWindows title={_t('Copy')} color={color.icon} size={ICON_SIZE} />}
                  onClick={copyHandler}
                />
              )}
              {deleteHandler && (
                <SvgButton
                  rootClassName={bem('button', 'delete')}
                  type="icon"
                  size="zero"
                  svgElement={<SvgTrash color={color.icon} title={_t('Delete')} size={ICON_SIZE} />}
                  onClick={deleteHandler}
                />
              )}
              {isEditable && (
                <SvgButton
                  rootClassName={bem('button', 'edit')}
                  type="icon"
                  size="zero"
                  svgElement={editIcon}
                  onClick={toggleEdit}
                />
              )}
              {isCollapsible && (
                <SvgButton
                  rootClassName={bem('button', 'collapse')}
                  type="icon"
                  size="zero"
                  svgElement={collapseIcon}
                  onClick={this.togglePanel}
                />
              )}
            </div>
          </div>
        )}
        <div
          data-test="panel-content"
          css={styles.content(isCollapsed, horizontalPadding, disableContentPadding)}
          className={bem('content', { isCollapsed })}
          aria-expanded={!isCollapsed}
        >
          {isRenderPropsFunction(children)
            ? children({ isEditing, toggleEdit, setEditState, setCollapseState })
            : children}
        </div>
      </div>
    );
  }
}

const Panel = withTheme(PanelCore);
export default Panel;
