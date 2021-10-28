import { MessageComponentHandler } from 'bot-message-component-handlers/MessageComponentHandler.types';
import { Awaitable, Collection, MessageComponentInteraction } from 'discord.js';

const handleMessageComponentEvent: (collected: Collection<string, MessageComponentInteraction | undefined>, reason: string) => Awaitable<void> =
	async interaction => {
		if (!interaction) return;

		const message = interaction.first();

		if (!message) {
			return;
		}

		const { customId } = message;
		const buttonHandlerModule = await import(`bot-message-component-handlers/modules/${customId}`);
		const handler: MessageComponentHandler = buttonHandlerModule.default;
		handler(message);
	};

export default handleMessageComponentEvent;