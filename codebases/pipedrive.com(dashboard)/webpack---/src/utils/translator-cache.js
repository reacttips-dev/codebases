let translatorPromise;

export const set = (newTranslatorPromise) => {
	translatorPromise = newTranslatorPromise;
};

export const get = () => translatorPromise;