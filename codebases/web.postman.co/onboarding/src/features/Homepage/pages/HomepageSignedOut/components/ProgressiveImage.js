import React from 'react';
import PropTypes from 'prop-types';

/**
 * displays low resolution placeholder image and then increase their resolution as the website loads completely.
 * takes src and placeholder as input props
 * returns a function with Image activeSrc, loading, srcSet and sizes
 */
class ProgressiveImage extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      activeSrc: props.placeholder
    };
  }

  componentDidMount () {
    const { src } = this.props,
      imageToLoad = new Image();

    imageToLoad.src = src;
    imageToLoad.onload = () => {
      // When image is loaded replace the image's src and set loading to false
      this.setState({ activeSrc: src, loading: false });
    };

  }

  render () {
    const { activeSrc, loading } = this.state,
      { srcSet, sizes, children } = this.props;

    return (
      <React.Fragment>
        {loading ?
          children(activeSrc, loading) :
          children(activeSrc, loading, srcSet, sizes)
        }
      </React.Fragment>
    );
  }
}

ProgressiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string
};


export default ProgressiveImage;
