import React, { Component } from "react";
import {
  StyledRemoveTagsButton,
  StyledTagsInputContainer,
  StyledTagsInputList,
} from "../styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class TldrTagsInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    };
  }

  removeTag = (i) => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  };

  addTag = (tagValue) => {
    const { applyTags } = this.props;
    const { tags } = this.state;

    if (tags.find((tag) => tag.toLowerCase() === tagValue.toLowerCase())) {
      return;
    }

    this.setState(
      {
        tags: [...tags, tagValue],
      },
      () => {
        if (applyTags) {
          applyTags([...tags, tagValue]);
        }
      }
    );

    this.tagInput.value = null;
  };

  inputKeyUp = (e) => {
    let val = e.target.value;
    val = val.replace(/,/g, "");
    this.tagInput.value = val;

    if (
      (e.key === "Enter" ||
        e.key === "," ||
        e.key === "Tab" ||
        (this.props.tagKey === "space" && e.key === " ")) &&
      val
    ) {
      this.addTag(val);
    } else if (e.key === "Backspace" && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
  };

  inputFocusOut = (e) => {
    let val = e.target.value;
    val = val.replace(/,/g, "");
    this.tagInput.value = val;

    if (val) {
      this.addTag(val);
    }
  };

  render() {
    const { tags } = this.state;
    const { as, field, ...props } = this.props;

    return (
      <StyledTagsInputContainer>
        <StyledTagsInputList>
          {tags.map((tag, i) => (
            <li key={tag} className="input-tag-pill">
              <p className="input-tag-text">{tag}</p>
              <StyledRemoveTagsButton onClick={() => this.removeTag(i)}>
                <FontAwesomeIcon icon={faTimes} size="1x" />
              </StyledRemoveTagsButton>
            </li>
          ))}
          <li className="input-tag-tags-input">
            {as === "input" ? (
              <input
                type="text"
                onKeyUp={this.inputKeyUp}
                onBlur={this.inputFocusOut}
                ref={(c) => {
                  this.tagInput = c;
                }}
              />
            ) : as === "textarea" ? (
              <textarea
                type="text"
                onKeyUp={this.inputKeyUp}
                onBlur={this.inputFocusOut}
                ref={(c) => {
                  this.tagInput = c;
                }}
                placeholder={this.props?.placeholder}
                {...field}
                {...props}
              />
            ) : null}
          </li>
        </StyledTagsInputList>
        {tags.length > 0 && (
          <div
            className="clear-tags-container"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({ tags: [] });
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        )}
      </StyledTagsInputContainer>
    );
  }
}

TldrTagsInput.propTypes = {};

export default TldrTagsInput;
