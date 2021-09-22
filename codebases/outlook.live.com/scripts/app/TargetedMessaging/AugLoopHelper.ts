/*
 * AugLoopHelper.ts
 */

import { ISession } from "@augloop/runtime-client";
import { IOperation, ISchemaObject, SchemaObject } from "@augloop/types-core";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";
import { AUGLOOP_INIT_CHECK_RETRY_TIMES } from "./TargetedMessagingConstants";

export interface IAugLoopResponse extends ISchemaObject {
	error?: any;
}

function sleep(milliseconds: number): Promise<void> {
	return new Promise<void>(resolve => {
		setTimeout(resolve, milliseconds);
	});
}

function getObjectProperty<T>(targetObject: any, propertyName: string): T {
	const propertyValue = targetObject && targetObject[propertyName];
	return (propertyValue || Object.getOwnPropertyDescriptor(targetObject, propertyName)) ? propertyValue : undefined;
}

// listen to property change on targetObject and return the value when it is set
function getDelayDefinedObjectValue<T>(targetObject: any, propertyName: string): Promise<T> {
	if (!targetObject) {
		return Promise.resolve(null);
	}

	const currentPropertyValue = getObjectProperty<T>(targetObject, propertyName);
	if (currentPropertyValue) {
		return Promise.resolve(currentPropertyValue);
	}

	return new Promise((resolve, reject) => {
		let propertyValue: T;
		Object.defineProperty(targetObject, propertyName, {
			configurable: true,
			enumerable: true,
			get: () => propertyValue,
			set: (newValue: T) => {
				propertyValue = newValue;
				resolve(propertyValue);
			},
		});
	});
}

async function getDelayDefinedValueWithWait<T>(targetObject: any, propertyName: string, retryTimes: number, delay = 100): Promise<T> {
	const definedProperty = getObjectProperty(targetObject, propertyName) as T;
	if (definedProperty || retryTimes === 0) {
		return definedProperty;
	}

	await sleep(delay);
	return getDelayDefinedValueWithWait(targetObject, propertyName, retryTimes - 1, delay);
}

// Invoke AL calls and get the data
function getAnnotationData(augLoopSession: ISession, annotationName: string): Promise<IAugLoopResponse> {
	return new Promise((resolve, reject) => {
		augLoopSession.activateAnnotation(annotationName, {
			callback: (operation: IOperation) => {
				try {
					const operationItems = operation && operation.items ? operation.items : [];
					const schemaObjects = operationItems.filter(item => annotationName === SchemaObject.getTypeNameFor(item.body));
					resolve(schemaObjects && schemaObjects[0] && schemaObjects[0].body);
				} catch (error) {
					resolve({error: error} as any);
				}
			},
		});
	});
}

// Get the Augloop global object - window.augLoop
async function getGlobalAugLoopRuntime(loadDelay = 100) {
	// try to get the augloop global runtime window.augLoop
	let augLoopRuntime = getObjectProperty(window, "augLoop");
	if (!augLoopRuntime) {
		const delayLoadTime = getDynamicSetting(SettingKey.tulipsAugLoopPackageDelayLoad, -1);
		if (delayLoadTime > 0) {
			// wait for augloop to load after sometime
			await sleep(delayLoadTime);
			augLoopRuntime = getObjectProperty(window, "augLoop");
		} else {
			const retryTimes = getDynamicSetting(SettingKey.tulipsAugLoopLoadRetryTimes, AUGLOOP_INIT_CHECK_RETRY_TIMES);
			augLoopRuntime = await getDelayDefinedValueWithWait(window, "augLoop", retryTimes, loadDelay);
			if (!augLoopRuntime) {
				// Wait for augloop to mount on window
				augLoopRuntime = await getDelayDefinedObjectValue(window, "augLoop");
			}

			if (loadDelay > 0) {
				await sleep(loadDelay);
			}
		}
	}

	return augLoopRuntime;
}

export async function getAugLoopAnnotationData(
	annotationName: string,
	getRuntimeSession?: () => Promise<ISession>,
	loadDelay = 100): Promise<ISchemaObject> {
	let augLoopSession = getRuntimeSession && await getRuntimeSession();
	if (!augLoopSession) {
		const augLoopRuntime = await getGlobalAugLoopRuntime(loadDelay);
		if (!augLoopRuntime) {
			throw new Error("Unable to get AL runtime");
		}

		const augLoopSessionPromise = (window as any).augLoop.ALFactoryGlobal.getAugLoopRuntimeManager().getSession() as Promise<ISession>;
		if (!augLoopSessionPromise) {
			throw new Error("Unable to get AL session promise");
		}

		augLoopSession = await augLoopSessionPromise;
		if (!augLoopSession) {
			throw new Error("Unable to get AL session");
		}
	}

	return getAnnotationData(augLoopSession, annotationName);
}
