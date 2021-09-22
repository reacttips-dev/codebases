import { GovernedChannel, GovernedChannelType, IGovernedChannelData } from "./GovernedChannel";
import { GovernedChannelState, IGovernedChannelStateProvider } from "./GovernedChannelStateProvider";
import * as Utils from "./Utils";

const { isNOU } = Utils;

export const DEFAULT_TEACHING_MESSAGE_COOLDOWN = 15;

export interface IGovernor {
	getAvailableChannelData(): IGovernedChannelData[];

	isChannelOpen(type: GovernedChannelType): boolean;

	startChannelCooldown(type: GovernedChannelType, date?: Date): void;

	refreshChannelData(): void;

	saveChannelStates(): void;
}

class DefaultChannelData {
	public cooldownSeconds: number;
	public name: string;

	public constructor(name: string, cooldownSeconds: number) {
		this.name = name;
		this.cooldownSeconds = cooldownSeconds;
	}
}

export class Governor implements IGovernor {
	public static GetChannelCoolDown(channelType: GovernedChannelType) {
		const channelData = Governor.defaultChannelData[channelType];
		return channelData ? channelData.cooldownSeconds : 0;
	}

	public static SetDefaultChannelCoolDown(channelType: GovernedChannelType, cooldownSeconds: number) {
		const channelData = Governor.defaultChannelData[channelType];
		if (channelData) {
			channelData.cooldownSeconds = cooldownSeconds;
		}
	}

	private static minute: number = 60;
	private static hour: number = 60 * Governor.minute;
	private static day: number = 24 * Governor.hour;

	// Array of default values for each channel type. Indexed by the GovernedChannelType enum name.
	private static defaultChannelData: DefaultChannelData[] = [
		new DefaultChannelData(GovernedChannelType[GovernedChannelType.Standard], 14 * Governor.day),
		new DefaultChannelData(GovernedChannelType[GovernedChannelType.Urgent], 0),
		new DefaultChannelData(GovernedChannelType[GovernedChannelType.Banner], 15 * Governor.day),
		new DefaultChannelData(GovernedChannelType[GovernedChannelType.TeachingMessage], DEFAULT_TEACHING_MESSAGE_COOLDOWN * Governor.day),
	];

	private channelStateProvider: IGovernedChannelStateProvider;
	private channels: GovernedChannel[] = [];

	public constructor(channelStateProvider: IGovernedChannelStateProvider) {
		if (!channelStateProvider) {
			throw new Error("channelStateProvider must not be null");
		}

		this.channelStateProvider = channelStateProvider;
		this.loadChannels();
	}

	// @Override
	public refreshChannelData(): void {
		this.loadChannels();
	}

	// @Override
	public getAvailableChannelData(): IGovernedChannelData[] {
		const channelData: IGovernedChannelData[] = [];

		for (const key in this.channels) {
			if (this.channels.hasOwnProperty(key)) {
				const channel: GovernedChannel = this.channels[key];

				if (channel.isOpen()) {
					channelData.push(channel);
				}
			}
		}

		return channelData;
	}

	// @Override
	public isChannelOpen(type: GovernedChannelType): boolean {
		if (isNOU(type)) {
			throw new Error("type must not be null");
		}

		return this.channels[type].isOpen();
	}

	// @Override
	public startChannelCooldown(type: GovernedChannelType, date?: Date): void {
		if (isNOU(type)) {
			throw new Error("type must not be null");
		}

		date = date ? date : new Date();

		// Start the cool down
		this.channels[type].setCooldownStartTime(date);

		// Save the new channel state for future sessions
		this.saveChannelStates();
	}

	public saveChannelStates(): void {
		// Build up the list of channel states
		const channelStates: GovernedChannelState[] = [];

		for (const key in this.channels) {
			if (this.channels.hasOwnProperty(key)) {
				const channel: GovernedChannel = this.channels[key];
				const channelState: GovernedChannelState =
					new GovernedChannelState(channel.getType(), channel.getCooldownStartTime());

				channelStates.push(channelState);
			}
		}

		this.channelStateProvider.save(channelStates);
	}

	private loadChannels(): void {
		// Load up state from previous sessions
		this.loadChannelStatesFromProvider();

		// For any missing channels, init them from scratch
		// There's no straightforward way to iterate enums, we need to iterate through the enum array
		//    filtering out just the numeric enum values (excluding enum names).
		for (const item in GovernedChannelType) {
			if (GovernedChannelType.hasOwnProperty(item)) {
				const key: number = Number(item);

				// skip if key is not numeric enum value, or if already exists
				if (isNaN(key) || this.channels[key]) {
					continue;
				}

				const defaultData: DefaultChannelData = Governor.defaultChannelData[key];
				const newChannel: GovernedChannel =
					new GovernedChannel(key, defaultData.name, defaultData.cooldownSeconds, null);
				this.channels[key] = newChannel;
			}
		}
	}

	private loadChannelStatesFromProvider(): void {
		this.channels = [];

		const channelStates: GovernedChannelState[] = this.channelStateProvider.load();

		for (const key in channelStates) {
			if (channelStates.hasOwnProperty(key)) {
				const channelState: GovernedChannelState = channelStates[key];

				const type: GovernedChannelType = channelState.getType();
				const defaultData: DefaultChannelData = Governor.defaultChannelData[type];
				const newChannel: GovernedChannel =
					new GovernedChannel(type, defaultData.name, defaultData.cooldownSeconds, channelState.getCooldownStartTime());

				this.channels[newChannel.getType()] = newChannel;
			}
		}
	}
}
