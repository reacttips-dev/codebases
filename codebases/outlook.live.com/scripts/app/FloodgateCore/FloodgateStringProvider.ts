/**
 * Implementation of IFloodgateStringProvider for Web SDK
 */

import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import * as UIStrings from "./../UIStrings/UIStrings";
import * as Configuration from "./../Configuration/Configuration";

/* tslint:disable:max-line-length */

export default class FloodgateStringProvider implements Api.IFloodgateStringProvider {
	public loadStringResource(stringId: Api.IFloodgateStringProvider.StringType): string {
		let uiStrings = UIStrings.getUIStrings();

		switch (stringId) {
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue0):		return uiStrings.Floodgate.Nps.Rating.Points11Value0;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue1):		return uiStrings.Floodgate.Nps.Rating.Points11Value1;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue2):		return uiStrings.Floodgate.Nps.Rating.Points11Value2;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue3):		return uiStrings.Floodgate.Nps.Rating.Points11Value3;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue4):		return uiStrings.Floodgate.Nps.Rating.Points11Value4;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue5):		return uiStrings.Floodgate.Nps.Rating.Points11Value5;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue6):		return uiStrings.Floodgate.Nps.Rating.Points11Value6;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue7):		return uiStrings.Floodgate.Nps.Rating.Points11Value7;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue8):		return uiStrings.Floodgate.Nps.Rating.Points11Value8;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue9):		return uiStrings.Floodgate.Nps.Rating.Points11Value9;
			case (Api.IFloodgateStringProvider.StringType.Nps11RatingValue10):		return uiStrings.Floodgate.Nps.Rating.Points11Value10;
			case (Api.IFloodgateStringProvider.StringType.Nps5RatingValue1):		return uiStrings.Floodgate.Nps.Rating.Points5Value1;
			case (Api.IFloodgateStringProvider.StringType.Nps5RatingValue2):		return uiStrings.Floodgate.Nps.Rating.Points5Value2;
			case (Api.IFloodgateStringProvider.StringType.Nps5RatingValue3):		return uiStrings.Floodgate.Nps.Rating.Points5Value3;
			case (Api.IFloodgateStringProvider.StringType.Nps5RatingValue4):		return uiStrings.Floodgate.Nps.Rating.Points5Value4;
			case (Api.IFloodgateStringProvider.StringType.Nps5RatingValue5):		return uiStrings.Floodgate.Nps.Rating.Points5Value5;
			case (Api.IFloodgateStringProvider.StringType.NpsRatingQuestion):		return uiStrings.Floodgate.Nps.Rating.Question;
			case (Api.IFloodgateStringProvider.StringType.NpsCommentQuestion):		return uiStrings.Floodgate.Nps.Comment.Question;
			case (Api.IFloodgateStringProvider.StringType.NpsPromptNotNowLabel):	return uiStrings.Floodgate.Nps.Prompt.No;
			case (Api.IFloodgateStringProvider.StringType.NpsPromptQuestion):		return uiStrings.Floodgate.Nps.Prompt.Question;
			case (Api.IFloodgateStringProvider.StringType.NpsPromptTitle):			return uiStrings.Floodgate.Nps.Prompt.Title;
			case (Api.IFloodgateStringProvider.StringType.NpsPromptYesLabel):		return uiStrings.Floodgate.Nps.Prompt.Yes;
			default:
				return "";
		}
	}

	public getCustomString(str: string): string {
		return Configuration.get().getFloodgateInitOptions().uIStringGetter(str);
	}
}
