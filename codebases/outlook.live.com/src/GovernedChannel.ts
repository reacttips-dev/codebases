import * as Utils from "./Utils";

export enum GovernedChannelType {
	Standard, // 0
	Urgent, // 1
	Banner, // 2
	TeachingMessage, // 3
}

export namespace GovernedChannelType {
	export function getDefault(): GovernedChannelType { return GovernedChannelType.Standard; }
}

export interface IGovernedChannelData {
	/**
	 * Gets the type of GovernedChannel this object represents
	 */
	getType(): GovernedChannelType;

	/**
	 * Gets the name of this GovernedChannel
	 */
	getName(): string;

	/**
	 * Gets the amount of time during which this channel will refuse new surveys after a successful prompt
	 */
	getCooldownSeconds(): number;

	/**
	 * Gets the last time this channel started a cool down (aka the last time a survey was successfully shown).
	 * Null if cool down has never been initiated
	 */
	getCooldownStartTime(): Date;

	/**
	 * If in cool down, returns the time in which this channel will next be "Open".
	 * Else returns the last time this channel became "Open".
	 */
	getCooldownEndTime(): Date;

	/**
	 * Whether or not this channel is open to new surveys at this current point in time (aka Now)
	 */
	isOpen(): boolean;

	/**
	 * Whether or not this channel is open to new surveys at the specified point in time
	 */
	isOpenAtDate(date: Date): boolean;
}

export class GovernedChannel implements IGovernedChannelData {
	private type: GovernedChannelType;
	private name: string;
	private cooldownSeconds: number;
	private cooldownStartTime: Date;
	private cooldownEndTime: Date;

	public constructor(type: GovernedChannelType, name: string, cooldownSeconds: number, cooldownStartTime: Date) {
		if (!Utils.isEnumValue(type, GovernedChannelType)) {
			throw new Error("type is not a valid GovernedChannelType");
		}

		if (!name) {
			throw new Error("name must not be null or empty");
		}

		if (cooldownSeconds < 0) {
			throw new Error("cooldownSeconds must not be negative");
		}

		this.type = type;
		this.name = name;
		this.cooldownSeconds = cooldownSeconds;
		this.setCooldownStartTime(cooldownStartTime);
	}

	public setCooldownStartTime(cooldownStartTime: Date): void {
		// Set the start time
		this.cooldownStartTime = cooldownStartTime;

		if (Utils.isNOU(this.cooldownStartTime)) {
			// Null cooldownStartTime means cool down has never been initiated, so set the cooldownEndTime to distant past
			this.cooldownEndTime = Utils.getDistantPast();
			return;
		}

		// Calculate the end time, but don't overflow past max.
		this.cooldownEndTime = Utils.addSecondsWithoutOverflow(this.cooldownStartTime, this.cooldownSeconds);
	}

	// @Override
	public isOpen(): boolean {
		return this.isOpenAtDate(new Date());
	}

	// @Override
	public isOpenAtDate(date: Date): boolean {
		if (!date) {
			return false;
		}

		return (date > this.cooldownEndTime);
	}

	// @Override
	public getType(): GovernedChannelType {
		return this.type;
	}

	// @Override
	public getName(): string {
		return this.name;
	}

	// @Override
	public getCooldownSeconds(): number {
		return this.cooldownSeconds;
	}

	// @Override
	public getCooldownStartTime(): Date {
		return this.cooldownStartTime;
	}

	// @Override
	public getCooldownEndTime(): Date {
		return this.cooldownEndTime;
	}
}
