import React from 'react';

import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import { ForumDropDownWithTheme, ForumDropDownOption } from 'bundles/discussions/components/forumsV2-ForumDropDown';

import { getForumLink } from 'bundles/discussions/utils/discussionsUrl';
import PropTypes from 'prop-types';
import { Forum } from 'bundles/discussions/lib/types';

type Props = {
  courseForums: OnDemandCourseForumsV1[];
  courseSlug: string;
  currentForum: Forum;
  selectedIndex?: number;
  param: 'forum' | 'subForum_id' | 'forum_id';
  onChange?: (forum: Forum, sort: string, pageNum: number, filterQueryString: string) => void;
  unsetOption?: ForumDropDownOption<string, string>;
  characterLimit?: number;
};

type State = {
  label?: string;
};
class TopLevelForumsDropDown extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static state = {
    label: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { label: this.context?.router?.location?.query[this.props.param] };
  }

  getSelectedLabel = () => {
    const urlParamValue = this.context?.router?.location?.query[this.props.param];
    for (let i = 0; i < this.props.courseForums.length; i += 1) {
      if (this.props.courseForums[i].id === urlParamValue) {
        return this.props.courseForums[i].title;
      } else if (this.props.selectedIndex) {
        return (
          this.props.courseForums[this.props.selectedIndex] && this.props.courseForums[this.props.selectedIndex].title
        );
      }
    }
    return undefined;
  };

  getForumLink = (forum) => {
    const newLink = getForumLink(forum.forumId);
    return newLink;
  };

  getForumOption = (forum: Forum): ForumDropDownOption<string, string> => {
    return { label: forum.title, param: this.props.param, value: forum.id, forum };
  };

  getForumsOptions = (subForums): ForumDropDownOption<string, string>[] => {
    let result: ForumDropDownOption<string, string>[] = [];
    if (subForums) {
      result = subForums.map(this.getForumOption);
      if (this.props.unsetOption) {
        result = [this.props.unsetOption, ...result];
      }
    }
    return result;
  };

  hasOptions = (options) => {
    const optionMinimumLength = this.props.unsetOption ? 2 : 1;
    return Array.isArray(options) && options.length >= optionMinimumLength;
  };

  render() {
    const options = this.getForumsOptions(this.props.courseForums);

    if (!this.hasOptions(options)) {
      return null;
    }

    const label = this.getSelectedLabel();

    return (
      <ForumDropDownWithTheme
        options={options}
        style={{ fontWeight: 600, fontSize: '20px', width: 'max-content' }}
        selectedLabel={label || this.state?.label}
        onChange={(option: ForumDropDownOption<string, string>) => {
          if (this.props.onChange && option.forum) {
            this.props.onChange(option.forum, 'asc', 1, '');
            this.setState({ label: option.label });
            this.context.router.push(this.context.router.location.pathname + '?' + option.param + '=' + option.value);
          } else {
            this.context.router.push(this.getForumLink(option.forum) + '?' + option.param + '=' + option.value);
          }
        }}
        characterLimit={this.props.characterLimit}
      />
    );
  }
}

export default TopLevelForumsDropDown;
