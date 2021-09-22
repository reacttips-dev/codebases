import { ContentType } from "./TargetedMessagingContentType";
import FloodgateStorageProvider from "../FloodgateCore/FloodgateStorageProvider";
import * as Utils from "../Utils";
import { FileType } from "@ms-ofb/officefloodgatecore/dist/src/Api/IFloodgateStorageProvider";

const { isNOU } = Utils;

export interface ICacheItem {
	contentType: ContentType;
	content: any;
	expiryDate: Date;
	lastRetrievedDate: Date;
}

export class TargetedMessagingCache {
	private useLocalStorage: boolean = false;
	private cachedItems: { [key: string]: ICacheItem } = {};
	private floodgateStorage: FloodgateStorageProvider;

	constructor(items: Array<ContentType>) {
		this.initialize(items);
	}

	public setContentItem(contentType: ContentType, content: any, expiryTime: number): ICacheItem {
		const cacheItem = this.createItem(contentType, content, expiryTime);
		this.setItem(cacheItem);
		return cacheItem;
	}

	public getItemContent<T>(contentType: ContentType): T {
		const cacheItem = this.getItem(contentType);
		return cacheItem && cacheItem.content;
	}

	public has(contentType: ContentType): boolean {
		return contentType in this.cachedItems;
	}

	public isItemExpired(contentType: ContentType): boolean {
		const cacheItem = this.getItem(contentType);
		return !cacheItem
			|| !cacheItem.expiryDate
			|| cacheItem.expiryDate < new Date();
	}

	private createItem(contentType: ContentType, content: any, expiryTime: number): ICacheItem {
		const cacheItem: ICacheItem = {
			contentType,
			content,
			expiryDate:  new Date(Date.now() + expiryTime),
			lastRetrievedDate: new Date(),
		};

		return cacheItem;
	}

	private setItem(cacheItem: ICacheItem): void {
		this.cachedItems[cacheItem.contentType] = cacheItem;
		this.updateItemInLocalStorage(cacheItem);
	}

	private getItem(contentType: ContentType): ICacheItem {
		return this.cachedItems[contentType];
	}

	private initialize(items: Array<ContentType>): void {
		this.cachedItems = {};
		if (FloodgateStorageProvider.isStorageAvailable()) {
			this.floodgateStorage = new FloodgateStorageProvider();
			this.useLocalStorage = true;

			// try to fetch items from local storage if available from prior sessions
			this.initCachedItemsFromLocalStorage(items);
		} else {
			// no LocalStorage support, only active object cache only
		}
	}

	private initCachedItemsFromLocalStorage(items: Array<ContentType>): void {
		if (this.useLocalStorage) {
			if (!isNOU(items)) {
				for (let contentKey of items) {
					let tempStorageItem: string = this.floodgateStorage.read(this.mapContentTypeToFloodgateProviderKey(contentKey));
					if (!isNOU(tempStorageItem)) {
						const tempCacheItem: ICacheItem = this.parseObjectFromCache(tempStorageItem);
						if (!isNOU(tempCacheItem)) {
							tempCacheItem.expiryDate = typeof tempCacheItem.expiryDate === "string" ?
								new Date(tempCacheItem.expiryDate) : tempCacheItem.expiryDate;
							this.cachedItems[tempCacheItem.contentType] = tempCacheItem;
						}
					}
				}
			}
		}
	}

	private updateItemInLocalStorage(cacheItem: ICacheItem): void {
		if (this.useLocalStorage) {
			this.floodgateStorage.write(
				this.mapContentTypeToFloodgateProviderKey(cacheItem.contentType),
				JSON.stringify(cacheItem));
		}
	}

	private parseObjectFromCache(tempItem: string): ICacheItem {
		try {
			const tempCacheItem: ICacheItem = JSON.parse(tempItem);
			return tempCacheItem;
		} catch (e) {
			return null;
		}
	}

	private mapContentTypeToFloodgateProviderKey(contentType: ContentType): FileType {
		switch (contentType) {
			case ContentType.campaignContent:
				return FileType.TmsCache_CampaignContent;
			case ContentType.messageMetadata:
				return FileType.TmsCache_MessageMetadata;
			case ContentType.userGovernanceRules:
				return FileType.TmsCache_UserGovernance;
			case ContentType.dynamicSettings:
				return FileType.Tms_DynamicSettings;
			case ContentType.logLevelSettings:
				return FileType.LogLevelSettings;
			case ContentType.userFacts:
				return FileType.UserFacts;
			default:
				throw new Error("Unmapped ContentType in TmsCache");
		}
	}
}
