import React from 'react';
import PropTypes from 'prop-types';

import Overlay from '../../../../shared/Overlay';
import Image from '../../../../shared/Image';
import ColorPicker from '../../../../shared/ColorPicker';
import Box from '../../../../shared/Box';
import Text from '../../../../shared/Text';
import Button from '../../../../shared/Button';
import Pressable from '../../../../shared/Pressable';
import Hoverable from '../../../../shared/Hoverable';
import Icon from '../../../../shared/Icon';
import If from '../../../../shared/If';
import Mask from '../../../../shared/Mask';
import Toggle from '../../../../shared/Toggle';
import DropdownButton from '../../../../shared/DropdownButton';
import Font from '../../../../shared/Font';
import TextImage from './components/TextImage';
import SceneHeading from '../SceneHeading';
import { Spinner } from '../../../../shared/Spinner';
import { FONTS } from '../../constants';
import styles from './EditTextScene.sass';
import { ToggleContainer } from './styles';

const getFontFromFontId = (fontId, fonts) => {
  const fontFromId = fonts.find(font => font.id === fontId);
  return fontFromId || null;
};

const noop = () => null;

export class EditTextScene extends React.PureComponent {
  render() {
    const {
      croppedCoverArtImageUrl,
      onToggleApplyText,
      textImageUrl,
      maybeSelectedFontId,
      textHex,
      isTextShowing,
      onSelectFont,
      onSelectJustification,
      justification,
      onSelectAlignment,
      alignment,
      onSelectColor,
      onSubmitCoverArt,
      isButtonDisabled,
      isButtonProcessing,
      isTextColorLoading,
      isTextImageLoading,
      isColorPickerShowing,
      isAnchorWatermarkShowing,
      onClickColorPickerHide,
      onClickColorPickerShow,
      setHasAnchorBranding,
    } = this.props;
    return (
      <Box width="100%">
        <SceneHeading title="Add text" />
        <Box display="flex" justifyContent="center" wrap width="100%">
          <Box
            width={300}
            smMarginLeft={20}
            smMarginRight={20}
            mdMarginLeft={40}
            mdMarginRight={40}
            lgMarginLeft={40}
            lgMarginRight={40}
          >
            <Box shape="rounded">
              <Mask shape="rounded">
                <Box position="relative">
                  <Image
                    renderLoadingPlaceholder={() => (
                      <Box width="300" height={300} color="gray" />
                    )}
                    height={300}
                    width={300}
                    imageUrl={croppedCoverArtImageUrl}
                  />
                  <If
                    condition={isTextShowing}
                    ifRender={() => (
                      <Box position="absolute" top left>
                        <If
                          condition={isTextImageLoading || isTextColorLoading}
                          ifRender={() => (
                            <Box
                              width={300}
                              height={300}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              color="rgba(255, 255, 255, .3)"
                            >
                              <Spinner size={60} color="#B3B3B4" />
                            </Box>
                          )}
                          elseRender={() => (
                            <TextImage
                              imageUrl={textImageUrl}
                              hex={textHex}
                              width={300}
                              height={300}
                            />
                          )}
                        />
                      </Box>
                    )}
                  />
                  <If
                    condition={isAnchorWatermarkShowing}
                    ifRender={() => (
                      <Box
                        position="absolute"
                        top
                        right
                        marginTop={15}
                        marginRight={16}
                        width={27}
                      >
                        <Icon type="anchor_logo" fillColor="white" />
                      </Box>
                    )}
                  />
                </Box>
              </Mask>
            </Box>
            <ToggleContainer>
              <Box>
                <Text color="#7f8287">Apply Text</Text>
              </Box>
              <Box>
                <Toggle
                  isChecked={isTextShowing}
                  onToggle={onToggleApplyText}
                />
              </Box>
            </ToggleContainer>
            <ToggleContainer>
              <Box>
                <Text color="#7f8287">Show Anchor logo on cover art</Text>
              </Box>
              <Box>
                <Toggle
                  isChecked={isAnchorWatermarkShowing}
                  onToggle={() =>
                    setHasAnchorBranding(!isAnchorWatermarkShowing)
                  }
                />
              </Box>
            </ToggleContainer>
          </Box>
          <Box
            width={300}
            smMarginLeft={20}
            smMarginRight={20}
            mdMarginLeft={40}
            mdMarginRight={40}
            lgMarginLeft={40}
            lgMarginRight={40}
            flex="grow"
            position="relative"
            maxWidth={480}
          >
            <Box width="100%" position="relative">
              <Box marginBottom={28}>
                <Box marginBottom={10}>
                  <Text color="#7f8287">Font</Text>
                </Box>
                <DropdownButton
                  items={FONTS}
                  renderItem={({ id, name }) => (
                    <Box
                      padding={10}
                      color={
                        id === maybeSelectedFontId ? 'gray' : 'transparent'
                      }
                    >
                      <Font fontName={id}>
                        <div style={{ fontSize: 20 }}>{name}</div>
                      </Font>
                    </Box>
                  )}
                  onSelectItem={font => {
                    onSelectFont(font);
                  }}
                  renderToggleButtonContent={() => (
                    <Text>
                      {maybeSelectedFontId ? (
                        getFontFromFontId(maybeSelectedFontId, FONTS) ? (
                          <Font fontName={maybeSelectedFontId}>
                            <div style={{ fontSize: 20 }}>
                              {
                                getFontFromFontId(maybeSelectedFontId, FONTS)
                                  .name
                              }
                            </div>
                          </Font>
                        ) : (
                          'error!' // TODO: This should 'never' happen... but we should do something incase it does
                        ) //
                      ) : (
                        'Choose one...'
                      )}
                    </Text>
                  )}
                  menuHeight="340px"
                />
              </Box>
              <Box marginBottom={28}>
                <Box marginBottom={10}>
                  <Text color="#7f8287">Horizontal Alignment</Text>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginTop={10}
                >
                  <Pressable
                    onPress={() => {
                      onSelectJustification('left');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box width={37} height={27}>
                            <Icon
                              type="justified_left"
                              fillColor={
                                justification === 'left' ? '#5000b9' : 'gray'
                              }
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectJustification('center');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box width={37} height={27}>
                            <Icon
                              type="justified_center"
                              fillColor={
                                justification === 'center' ? '#5000b9' : 'gray'
                              }
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectJustification('right');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box width={37} height={27}>
                            <Icon
                              type="justified_right"
                              fillColor={
                                justification === 'right' ? '#5000b9' : 'gray'
                              }
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                </Box>
              </Box>
              <Box marginBottom={28}>
                <Box marginBottom={10}>
                  <Text color="#7f8287">Vertical Alignment</Text>
                </Box>
                <Box
                  marginTop={4}
                  marginBottom={4}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Box width="30%">
                    <Pressable
                      onPress={() => {
                        onSelectAlignment('top');
                      }}
                      fullWidth
                    >
                      {({ isPressed }) => (
                        <Hoverable fullWidth>
                          {({ isHovering }) => (
                            <Box
                              shape="rounded"
                              borderWidth={2}
                              borderColor={
                                alignment === 'top' ? '#5000b9' : '#7f8287'
                              }
                              color={
                                alignment === 'top'
                                  ? isPressed
                                    ? '#6732B9'
                                    : ' #5000b9'
                                  : isPressed
                                  ? '#dfe0e1'
                                  : 'white'
                              }
                            >
                              <Box paddingTop={12} paddingBottom={12}>
                                <Text
                                  color={
                                    alignment === 'top' ? 'white' : '#7f8287'
                                  }
                                  align="center"
                                >
                                  Top
                                </Text>
                              </Box>
                            </Box>
                          )}
                        </Hoverable>
                      )}
                    </Pressable>
                  </Box>

                  <Box width="30%">
                    <Pressable
                      onPress={() => {
                        onSelectAlignment('center');
                      }}
                      fullWidth
                    >
                      {({ isPressed }) => (
                        <Hoverable fullWidth>
                          {({ isHovering }) => (
                            <Box
                              shape="rounded"
                              borderWidth={2}
                              borderColor={
                                alignment === 'center' ? '#5000b9' : '#7f8287'
                              }
                              color={
                                alignment === 'center'
                                  ? isPressed
                                    ? '#6732B9'
                                    : ' #5000b9'
                                  : isPressed
                                  ? '#dfe0e1'
                                  : 'white'
                              }
                            >
                              <Box paddingTop={12} paddingBottom={12}>
                                <Text
                                  color={
                                    alignment === 'center' ? 'white' : '#7f8287'
                                  }
                                  align="center"
                                >
                                  Center
                                </Text>
                              </Box>
                            </Box>
                          )}
                        </Hoverable>
                      )}
                    </Pressable>
                  </Box>
                  <Box width="30%">
                    <Pressable
                      onPress={() => {
                        onSelectAlignment('bottom');
                      }}
                      fullWidth
                    >
                      {({ isPressed }) => (
                        <Hoverable fullWidth>
                          {({ isHovering }) => (
                            <Box
                              shape="rounded"
                              borderWidth={2}
                              borderColor={
                                alignment === 'bottom' ? '#5000b9' : '#7f8287'
                              }
                              color={
                                alignment === 'bottom'
                                  ? isPressed
                                    ? '#6732B9'
                                    : ' #5000b9'
                                  : isPressed
                                  ? '#dfe0e1'
                                  : 'white'
                              }
                            >
                              <Box paddingTop={12} paddingBottom={12}>
                                <Text
                                  color={
                                    alignment === 'bottom' ? 'white' : '#7f8287'
                                  }
                                  align="center"
                                >
                                  Bottom
                                </Text>
                              </Box>
                            </Box>
                          )}
                        </Hoverable>
                      )}
                    </Pressable>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box marginBottom={10}>
                  <Text color="#7f8287">Color</Text>
                </Box>
                <Box
                  marginTop={4}
                  marginBottom={4}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Pressable
                    onPress={() => {
                      onSelectColor('#292f36');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#292f36"
                            borderColor={isHovering ? '#dfe0e1' : '#292f36'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#292f36'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectColor('#ffffff');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#ffffff"
                            borderColor={isHovering ? '#dfe0e1' : '#dfe0e1'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#ffffff'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectColor('#dfe0e1');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#dfe0e1"
                            borderColor={isHovering ? '#dfe0e1' : '#dfe0e1'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#dfe0e1'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectColor('#979797');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#979797"
                            borderColor={isHovering ? '#dfe0e1' : '#979797'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#979797'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectColor('#5000b9');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#5000b9"
                            borderColor={isHovering ? '#dfe0e1' : '#5000b9'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#5000b9'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      onSelectColor('#2dcfb3');
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={40}
                            height={40}
                            color="#2dcfb3"
                            borderColor={isHovering ? '#dfe0e1' : '#2dcfb3'}
                            borderWidth={1}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <If
                              condition={textHex === '#2dcfb3'}
                              ifRender={() => (
                                <Box width={20}>
                                  <Icon type="checkmark" fillColor="#5000b9" />
                                </Box>
                              )}
                            />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                  <Box position="relative">
                    <Pressable
                      onPress={e => {
                        e.stopPropagation();
                        onClickColorPickerShow();
                      }}
                    >
                      {isPressing => (
                        <Hoverable>
                          {({ isHovering }) => (
                            <>
                              <Box
                                shape="rounded"
                                width={40}
                                height={40}
                                color="#f2f2f3"
                                borderColor={isHovering ? '#dfe0e1' : '#dfe0e1'}
                                borderWidth={1}
                                padding={5}
                              >
                                <Icon type="eye_dropper" fillColor="#979797" />
                              </Box>
                            </>
                          )}
                        </Hoverable>
                      )}
                    </Pressable>
                  </Box>
                  {/* Positioned relative to surrounding box */}
                  <Overlay
                    isShowing={isColorPickerShowing}
                    onClickOutside={onClickColorPickerHide}
                    rootClose
                    container={this}
                    renderContent={() => (
                      <div className={styles.colorPickerOverlay}>
                        <ColorPicker
                          hex={textHex}
                          onSelectColor={onSelectColor}
                          disableAlpha
                        />
                      </div>
                    )}
                  />
                </Box>
                <If
                  condition={!isTextShowing}
                  ifRender={() => (
                    <Box
                      position="absolute"
                      color="rgba(255,255,255, .6)"
                      top
                      right
                      left
                      bottom
                    />
                  )}
                />
              </Box>
            </Box>
            <Box marginTop={80} display="flex" justifyContent="flex-end">
              <Box width={300}>
                <Pressable
                  onPress={isButtonDisabled ? null : onSubmitCoverArt}
                  fullWidth
                >
                  {({ isPressed }) => (
                    <Hoverable fullWidth>
                      {({ isHovering }) => (
                        <Button
                          isDisabled={isButtonDisabled}
                          isProcessing={isButtonProcessing}
                          isHovered={isHovering}
                          isActive={isPressed}
                          size="md"
                          text="Update cover art"
                          colorTheme="primary"
                          shape="pill"
                          isFullWidth
                        />
                      )}
                    </Hoverable>
                  )}
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

EditTextScene.defaultProps = {
  croppedCoverArtImageUrl: '',
  onToggleApplyText: noop,
  textImageUrl: '',
  textHex: '#ffffff',
  isTextShowing: true,
  onSelectFont: noop,
  onSelectJustification: noop,
  justification: 'center',
  onSelectAlignment: noop,
  alignment: 'top',
  onSelectColor: noop,
  onSubmitCoverArt: noop,
  isButtonDisabled: false,
  isButtonProcessing: false,
  isTextImageLoading: false,
  maybeSelectedFontId: null,
  isColorPickerShowing: false,
  isAnchorWatermarkShowing: false,
  onClickColorPickerHide: noop,
  onClickColorPickerShow: noop,
  isTextColorLoading: false,
};

EditTextScene.propTypes = {
  croppedCoverArtImageUrl: PropTypes.string,
  textImageUrl: PropTypes.string,
  textHex: PropTypes.string,
  isTextShowing: PropTypes.bool,
  onSelectFont: PropTypes.func,
  onToggleApplyText: PropTypes.func,
  onSelectJustification: PropTypes.func,
  justification: PropTypes.oneOf(['left', 'center', 'right']),
  onSelectAlignment: PropTypes.func,
  alignment: PropTypes.oneOf(['top', 'center', 'bottom']),
  onSelectColor: PropTypes.func,
  onSubmitCoverArt: PropTypes.func,
  isButtonDisabled: PropTypes.bool,
  isTextImageLoading: PropTypes.bool,
  isButtonProcessing: PropTypes.bool,
  maybeSelectedFontId: PropTypes.string,
  isColorPickerShowing: PropTypes.bool,
  isAnchorWatermarkShowing: PropTypes.bool,
  onClickColorPickerHide: PropTypes.func,
  onClickColorPickerShow: PropTypes.func,
  isTextColorLoading: PropTypes.bool,
};
