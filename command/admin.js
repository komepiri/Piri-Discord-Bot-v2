const { MessageFlags } = require("discord.js");

module.exports = {
    data: {
        name: 'admincmd',
        description: 'Bot管理者専用コマンドのグループです。',
        options: [
            {
                type: 1, 
                name: 'list-servers',
                description: 'Botが現在加入しているサーバーの一覧を取得します。',
            },
            {
                type: 1,
                name: 'leave-server',
                description: '指定されたサーバーからBotを退出させます。',
                options: [
                    {
                        type: 3, 
                        name: 'server-id',
                        description: '退出させたいサーバーのIDを入力してください。',
                        required: true,
                    },
                ],
            }
        ],
    },
    async execute(interaction) {
        if (interaction.user.id !== process.env.BOT_OWNER_ID) return await interaction.reply({ content: 'このコマンドを実行する権限がありません。', flags: MessageFlags.Ephemeral });
        if (interaction.options.getSubcommand() === 'list-servers') {
            const guilds = interaction.client.guilds.cache.map(guild => `${guild.name} (ID: ${guild.id})`).join('\n');

            const embed = {
                title: 'Botが加入しているサーバー一覧',
                description: guilds || '現在、Botはどのサーバーにも加入していません。',
                color: 0x00ff00,
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } else if (interaction.options.getSubcommand() === 'leave-server') {
            const serverId = interaction.options.getString('server-id');
            const guild = interaction.client.guilds.cache.get(serverId);
            if (!guild) {
                await interaction.reply({ content: '指定されたサーバーが見つかりません。', flags: MessageFlags.Ephemeral });
                return;
            }
            await guild.leave();
            await interaction.reply({ content: `サーバー ${guild.name} から退出しました。`, flags: MessageFlags.Ephemeral });
        }
    },
};