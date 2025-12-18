module.exports = {
    data: {
        name: 'ping',
        description: '現在のBotのPing値を返します。',
    },
    async execute(interaction) {
        await interaction.reply(`Pong!\n現在のBotのPingは ${interaction.client.ws.ping} ms です。`);
    },
};