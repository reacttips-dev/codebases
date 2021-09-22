/**
 * Screenshot.ts
 * Module for managing the screenshot file
 */

/* tslint:disable max-line-length */
import {IFile} from "./IFile";
import * as Logging from "./../../Logging/Logging";

export class Screenshot implements IFile {
	private screenshot: HTMLCanvasElement;

	constructor (screenshot: HTMLCanvasElement) {
		this.screenshot = screenshot;
	}

	public getContent(): Blob {
		let imgString: string;
		try {
			imgString = this.screenshot.toDataURL("image/jpeg").split(",")[1];
		} catch (e) {
			Logging.getLogger().logEvent(Logging.EventIds.Shared.Screenshot.GetContent.Failed.DefaultImage.Returned.VALUE,
				Logging.LogLevel.Error, { ErrorMessage: e.toString() });

			// return an image with "Screenshot cannot be captured" message
			imgString = "iVBORw0KGgoAAAANSUhEUgAAAN0AAAA+AQMAAACV2ox1AAAABGdBTUEAALGPC/xhBQAAAAZQTFRFAAAA////pdmf3QAAAAlwSFlzAAAOwgAADsIBFShKgAAAAjtJREFUSMfV1M1rE0EUAHDBa5r8A9vkL6giFiI0JH+Ih9KLx8TaukkJugShHgrJzYvkVPQkUqgwSePLEELaU+zBg8JKVvSQQNydlsadwCQzziRZ82ETxYMfc3gD8+MxjzcfV8T80f0vkQ8i68tAPSMSQ0PkI6QDpEPkZBHy1Wp1/zjni2lrZq2T2uikDG17A54Hr0vsvwXIl3WXt02zeIHQBSq3DxHk7VO55zIFgLLrcmaaQBGiqCwQArBVQTbNZODNBB5Ee2EEr5eGiDG4k5mcqcy+Ksh+N8K2+bRI1Z68fRMVoV+XmcFwpQJZGohpkds1WtjppGLaq51a2b8yp310UW9/H8VfRj68CIKRsWCFPCCEM419S4bSAOmPmdb3TBrQ4lmnt9n4/Hiv5fTunsOzXbJfLR2rU3Fd5ugOe9mw0lvNOCNxyDdIHkpHCv0S3a+MS0yT+4wkAKx1gBJeVxeMRhSeNZpXJfY+zqAVl+g0mCFRJMgs6oy9+MCMrWZaJJwiWFjuWcIShf+Wk2W9e59OHu21WPdsswZNLKs9wV77mJiaMVbBQ+/1jGZDofFLuOBU/jzG6OQKnkLOZ5EvwolMX2Q19TAX9MWyy/aNarewfZptechdLn8B3TatB/YXB2j4MKw3jTHKX4AO0CbqaSddMokHUbr0PpSXmFG4O4WIu86asCVihfoM6nUmse5gGkbJOyThVesX4UI0d00LBYMr55VuIZl8MkY1uOiTy9v3c+ShuXj5+NdQdL8B+5gmw8WZuREAAAAASUVORK5CYII=";
		}

		let blobBin = atob(imgString);
		let array = [];
		for (let i = 0; i < blobBin.length; i++) {
			array.push(blobBin.charCodeAt(i));
		}
		let file: Blob = new Blob([new Uint8Array(array)], {type: "image/jpeg"});

		return file;
	}
}
