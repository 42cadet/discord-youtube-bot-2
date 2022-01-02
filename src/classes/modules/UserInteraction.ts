import { ResponseEmojis } from 'bot-config';
import { CommandInteraction, Guild, GuildMember, InteractionReplyOptions } from 'discord.js';

export default class UserInteraction {
	protected interaction: CommandInteraction;
	protected invoked: Date; // A Date instance representing when this command was run.

	/**
	 * A toolbox for making interactions between the bot and the user easier.
	 *
	 * TIPS:
	 * - The methods in this class will throw if there is any problem. This is a way of halting the execution of the command.
	 * - Use the "oops" method in a catch block to inform the user of the error message and
	 */
	constructor(interaction: CommandInteraction) {
		this.interaction = interaction;
		this.invoked = new Date();
	}

	/**
	 * Initialise this instance by gathering the command handler and telling the Discord API the response has been received.
	 * @param ephemeral Hide the interactions and self-hide after a period of time.
	 */
	async init(ephemeral = true) {
		if (this.commandName) {
			await this.interaction.deferReply({ ephemeral });

			return this;
		}

		throw new Error('Unable to retrieve command name.');
	}

	get commandInteraction() {
		return this.interaction;
	}

	get guild() {
		if (this.interaction.guild instanceof Guild) {
			return this.interaction.guild;
		}

		throw Error('This command can only be run in a Guild.');
	}

	/**
	 * Get the author of the slash command.
	 */
	get author() {
		if (this.interaction.member instanceof GuildMember) {
			return this.interaction.member;
		}

		throw Error('Unable to retrieve guild member.');
	}

	get commandName() {
		if (this.interaction.isCommand()) {
			return this.interaction.commandName;
		}

		throw Error('Unable to fetch command name.');
	}

	/**
	 * Get the voice channel instance. Will throw an error if it does not exist.
	 */
	get voiceChannel() {
		if (this.author.voice?.channel) {
			return this.author.voice.channel;
		}

		throw Error('Must be connected to a voice channel to continue!');
	}

	/**
	 * Prepend an emoji to the message.
	 * @param message The message to send.
	 * @param type The enum for the emoji.
	 */
	followUpEmoji(message: string | InteractionReplyOptions, type?: ResponseEmojis) {
		if (typeof message === 'string') {
			return this.interaction.followUp(`${type}  ${message}`);
		}

		message.content = `${type}  ${message.content}`;

		return this.interaction.followUp(message);
	}

	editWithEmoji(message: string | InteractionReplyOptions, type: ResponseEmojis) {
		if (typeof message === 'string') {
			return this.interaction.editReply(`${type}  ${message}`);
		}

		message.content = `${type}  ${message.content}`;

		return this.interaction.editReply(message);
	}
}