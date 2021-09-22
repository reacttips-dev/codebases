/**
 * Constants.ts
 *
 * A module for all UI constants.
 */

/**
 * HTML attribute names
 */
export class AttributeName {
	public static Alt: string = "alt";
	public static AriaLabel: string = "aria-label";
	public static AriaSelected: string = "aria-selected";
	public static AriaOrientation: string = "aria-orientation";
	public static AriaExpanded: string = "aria-expanded";
	public static AriaControls: string = "aria-controls";
	public static AriaHasPopups: string = "aria-haspopup";
	public static AriaModal: string = "aria-modal";
	public static AriaLabelledBy: string = "aria-labelledby";
	public static AriaDescribedBy: string = "aria-describedby";
	public static Class: string = "class";
	public static DataHtml2CanvasIgnore: string = "data-html2canvas-ignore";
	public static Disabled: string = "disabled";
	public static Fill: string = "fill";
	public static For: string = "for";
	public static Preview: string = "preview";
	public static Form: string = "form";
	public static Height: string = "height";
	public static HRef: string = "href";
	public static Id: string = "id";
	public static MaxLength: string = "maxlength";
	public static Name: string = "name";
	public static Placeholder: string = "placeholder";
	public static Points: string = "points";
	public static Rel: string = "rel";
	public static Role: string = "role";
	public static Source: string = "src";
	public static Stroke: string = "stroke";
	public static TabIndex: string = "tabindex";
	public static Target: string = "target";
	public static Transform: string = "transform";
	public static Type: string = "type";
	public static Value: string = "value";
	public static ViewBox: string = "viewBox";
	public static Width: string = "width";
	public static xlinkHref: string = "xlink:href";
	public static X: string = "x";
	public static Y: string = "y";
}

/**
 * HTML attribute values
 */
export class AttributeValue {
	public static BlankWindow: string = "_blank";
	public static Button: string = "button";
	public static Dialog: string = "dialog";
	public static Tab: string = "tab";
	public static TabList: string = "tablist";
	public static TabPanel: string = "tabpanel";
	public static Checkbox: string = "checkbox";
	public static Checked: string = "checked";
	public static False: string = "false";
	public static Zero: string = "0";
	public static Polite: string = "polite";
	public static Radio: string = "radio";
	public static Submit: string = "submit";
	public static ScreenshotPreview: string = "ScreenshotPreview";
	public static Text: string = "text";
	public static TextAreaMaxLength: string = "1000";
	public static True: string = "true";
	public static Unchecked: string = "unchecked";
	public static NoReferrer: string = "noreferrer";
	public static AriaOrientationValueVertical = "vertical";
}

/**
 * URL Parameters
 */
export class UrlParameters {
	public static CLCID: string = "CLCID";
}

/**
 * CSS classes
 */
export class Classes {
	public static AriaLiveTemplate: string = "obf-AriaLiveTemplate";
	public static CheckBox: string = "obf-CheckBox";
	public static FontTitle: string = "obf-FontTitle";
	public static CloseButton: string = "obf-CloseButton";
	public static FontSubtitle: string = "obf-FontSubtitle";
	public static FontText: string = "obf-FontText";
	public static FontSubText: string = "obf-FontSubText";
	public static FontSubSubText: string = "obf-FontSubSubText";
	public static Hidden: string = "obf-Hidden";
	public static Link: string = "obf-Link";
	public static MarginLeft60px: string = "obf-MarginLeft60px";
	public static MarginLeft180px: string = "obf-MarginLeft180px";
	public static NarrowLayout: string = "obf-NarrowLayout";
	public static PrivacyStatementLinkDiv: string = "obf-PrivacyStatementLinkDiv";
	public static Rtl: string = "obf-Rtl";
	public static Spinner: string = "obf-Spinner";
	public static SpinnerCircle: string = "obf-SpinnerCircle";
	public static SubmitButton: string = "obf-SubmitButton";
	public static CancelButton: string = "obf-CancelButton";
	public static TextInput: string = "obf-TextInput";
	public static Visible: string = "obf-Visible";

	// rating control
	public static Rating: string = "obf-Rating";
	public static RatingGraphic: string = "obf-RatingGraphic";
	public static RatingGraphicFilled: string = "obf-RatingGraphic-Filled";

	// choice group control
	public static ChoiceGroup: string = "obf-ChoiceGroup";
	public static ChoiceGroupIcon: string = "obf-ChoiceGroupIcon";

	// region BellyBand

	public static OverallAnchor: string = "obf-OverallAnchor";
	public static OverallAnchorActive: string = "obf-OverallAnchorActive";
	public static OverallImage: string = "obf-OverallImage";
	public static OverallText: string = "obf-OverallText";
	public static SingleLayout: string = "obf-SingleLayout";
	public static ShowRightBorder: string = "obf-ShowRightBorder";
	public static SlideLeft: string = "obf-slideLeft";
	public static TextAlignLeft: string = "obf-TextAlignLeft";
	public static FormContainer: string = "obf-FormContainer";
	public static FormWideContainer: string = "obf-FormWideContainer";

	// region ThanksPanel
	public static ThanksPanelTitle: string = "obf-ThanksPanelTitle";
	public static ThanksPanelMessage: string = "obf-ThanksPanelMessage";

	// form classes
	public static FormQuestionMiddleText: string = "obf-FormQuestionMiddleText";
	public static FormMiddleText: string = "obf-FormMiddleText";
	public static FormCategoriesDropdown: string = "obf-FormCategoriesDropdown";
	public static FormComment: string = "obf-FormComment";
	public static FormRatingContainer: string = "obf-FormRatingContainer";
	public static FormRatingLabel: string = "obf-FormRatingLabel";
	public static FormRating: string = "obf-FormRating";
	public static FormEmailContainer: string = "obf-FormEmailContainer";
	public static FormEmailInput: string = "obf-FormEmailInput";
	public static FormEmailTextBox: string = "obf-FormEmailTextBox";
	public static FormEmailCheckBox: string = "obf-FormEmailCheckBox";
	public static FormEmailLabel: string = "obf-FormEmailLabel";
	public static FormBottomContainer: string = "obf-FormBottomContainer";
	public static FormSubmitButtonContainer: string = "obf-FormSubmitButtonContainer";
	public static FormScreenshotContainer: string = "obf-FormScreenshotContainer";
	public static FormScreenshotLabel: string = "obf-FormScreenshotLabel";
	public static FormScreenshotCheckbox: string = "obf-FormScreenshotCheckbox";
	public static FormScreenshotPreview: string = "obf-FormScreenshotPreview";
	// email textbox classes
	public static TFormEmailCheckbox: string = "obf-TFormEmailCheckbox";
	public static TFormEmailLabel: string = "obf-TFormEmailLabel ";

	// email checkbox classes
	public static EmailCheckBoxLabel: string = "obf-EmailCheckBoxLabel";

	// endregion

	// region Toast

	public static Toast: string = "obf-Toast";
	public static ToastZoom: string = "obf-ToastZoom";

	// endregion
}

/**
 * HTML element ids
 */
export class IDs {
	// region BellyBand
	public static CloseButton: string = "obf-CloseButton";
	public static ColumnSeparatorDiv: string = "obf-ColumnSeparatorDiv";
	public static OverallAnchorsContainer: string = "obf-OverallAnchorsContainer";
	public static OverallFrownAnchor: string = "obf-OverallFrownAnchor";
	public static OverallFrownDiv: string = "obf-OverallFrownDiv";
	public static OverallFrownImage: string = "obf-OverallFrownImage";
	public static OverallFrownText: string = "obf-OverallFrownText";
	public static OverallSmileAnchor: string = "obf-OverallSmileAnchor";
	public static OverallSmileDiv: string = "obf-OverallSmileDiv";
	public static OverallSmileImage: string = "obf-OverallSmileImage";
	public static OverallSmileText: string = "obf-OverallSmileText";
	public static OverallIdeaAnchor: string = "obf-OverallIdeaAnchor";
	public static OverallIdeaDiv: string = "obf-OverallIdeaDiv";
	public static OverallIdeaImage: string = "obf-OverallIdeaImage";
	public static OverallIdeaText: string = "obf-OverallIdeaText";
	public static OverallBugAnchor: string = "obf-OverallBugAnchor";
	public static OverallBugDiv: string = "obf-OverallBugDiv";
	public static OverallBugImage: string = "obf-OverallBugImage";
	public static OverallBugText: string = "obf-OverallBugText";
	public static QuestionLeftText: string = "obf-QuestionLeftText";
	public static LeftFormContainer: string = "obf-LeftFormContainer";
	public static LeftPanelContainer: string = "obf-LeftPanelContainer";
	public static MainContainer: string = "obf-MainContainer";
	public static MainContentHolder: string = "obf-MainContentHolder";
	public static MiddleFormContainer: string = "obf-MiddleFormContainer";
	public static OverlayBackground: string = "obf-OverlayBackground";
	public static PrivacyStatementLink: string = "obf-PrivacyStatementLink";
	public static FirstTabbable: string = "obf-FirstTabbable";
	public static LastTabbable: string = "obf-LastTabbable";
	public static EmailCheckBox: string = "obf-EmailCheckBox";

	// Single form ids
	public static SingleFormContainer: string = "obf-SingleFormContainer";
	public static SingleFormQuestionMiddleText: string = "obf-SingleFormQuestionMiddleText";
	public static SingleFormCategoriesDropdown: string = "obf-SingleFormCategoriesDropdown";
	public static SingleFormComment: string = "obf-SingleFormComment";
	public static SingleFormEmailInput: string = "obf-SingleFormEmailInput";
	public static SingleFormRating: string = "obf-SingleFormRating";
	public static SingleFormScreenshotCheckbox: string = "obf-SingleFormScreenshotCheckbox";
	public static SingleFormScreenshotPreview: string = "obf-SingleFormScreenshotPreview";
	public static SingleFormSubmitButton: string = "obf-SingleFormSubmitButton";
	public static SingleFormCancelButton: string = "obf-SingleFormCancelButton";
	public static SingleFormSubmitButtonSpinner: string = "obf-SingleFormSubmitButtonSpinner";

	// Basic form ids
	public static BasicFormContainer: string = "obf-BasicFormContainer";
	public static BasicFormQuestionMiddleText: string = "obf-BasicFormQuestionMiddleText";
	public static BasicFormCategoriesDropdown: string = "obf-BasicFormCategoriesDropdown";
	public static BasicFormComment: string = "obf-BasicFormComment";
	public static BasicFormEmailInput: string = "obf-BasicFormEmailInput";
	public static BasicFormRating: string = "obf-BasicFormRating";
	public static BasicFormScreenshotCheckbox: string = "obf-BasicFormScreenshotCheckbox";
	public static BasicFormScreenshotPreview: string = "obf-BasicFormScreenshotPreview";
	public static BasicFormSubmitButton: string = "obf-BasicFormSubmitButton";
	public static BasicFormCancelButton: string = "obf-BasicFormCancelButton";
	public static BasicFormSubmitButtonSpinner: string = "obf-BasicFormSubmitButtonSpinner";

	// Thanks Panel ids
	public static ThanksPanelContainer: string = "obf-ThanksPanelContainer";
	public static ThanksPanelCloseButton: string = "obf-ThanksPanelCloseButton";
	public static ThanksPanelDiscussion: string = "obf-ThanksPanelDiscussion";
	public static ThanksPanelVerticalContainer: string = "obf-ThanksPanelVerticalContainer";
	public static ThanksPanelInnerContainer: string = "obf-ThanksPanelInnerContainer";

	// UserVoice form ids
	public static UserVoiceFormContainer: string = "obf-UserVoiceFormContainer";
	public static UserVoiceFormGoButton: string = "obf-UserVoiceFormGoButton";

	// endregion

	// region Toast
	public static ToastContainer: string = "obf-ToastContainer";
	public static ToastCancel: string = "obf-ToastCancel";

	// Prompt ids
	public static TPromptContainer: string = "obf-TPromptContainer";
	public static TPromptTitle: string = "obf-TPromptTitle";
	public static TPromptText: string = "obf-TPromptText";

	// Survey ids
	public static TFormContainer: string = "obf-TFormContainer";
	public static TFormTitle: string = "obf-TFormTitle";
	public static TFormRating: string = "obf-TFormRating";
	public static TFormRatingQuestion: string = "obf-TFormRatingQuestion";
	public static TFormComment: string = "obf-TFormComment";
	public static TFormEmailTextBox: string = "obf-TFormEmailTextBox";
	public static TFormEmailCheckBox: string = "obf-TFormEmailCheckBox";
	public static TFormEmailLabel: string = "obf-TFormEmailLabel";
	public static TFormSubmitButton: string = "obf-TFormSubmitButton";
	public static TFormSubmitButtonSpinner: string = "obf-TFormSubmitButtonSpinner";
	public static TFormSubmitButtonContainer: string = "obf-TFormSubmitButtonContainer";

	// endregion
}

/**
 * Keys
 */
export class Keys {
	public static Esc: number = 27;
	public static Tab: number = 9;
}

/**
 * HTML tags
 */
export class Tags {
	public static Anchor: string = "A";
	public static Button: string = "button";
	public static Defs: string = "defs";
	public static Div: string = "div";
	public static FieldSet: string = "fieldset";
	public static Form: string = "form";
	public static Img: string = "img";
	public static Input: string = "input";
	public static Label: string = "label";
	public static Legend: string = "legend";
	public static Option: string = "option";
	public static Polygon: string = "polygon";
	public static Select: string = "select";
	public static Span: string = "span";
	public static Svg: string = "svg";
	public static TextArea: string = "textarea";
	public static Use: string = "use";
}

/**
 * HTML roles
 */
export class Roles {
	public static Button: string = "Button";
}

/**
 * URLs
 */
export class Urls {
	/**
	 * Link to the feedback Privacy Statement
	 */
	public static PrivacyStatementLink: string = "https://go.microsoft.com/fwlink/?LinkId=521839";
}
