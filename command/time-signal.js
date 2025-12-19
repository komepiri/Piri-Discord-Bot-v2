const fs = require('fs');
const path = require('path');
module.exports = {
    data: {
        name: 'time-signal',
        description: '現在の時刻を定期的に知らせます。',
        options: [
            {
                name: 'set',
                type: 1, 
                description: '時報を送るチャンネルを設定します。',
                options: [
                    {
                        name: 'channel',
                        type: 7, 
                        description: '時報を送信するチャンネルを選択してください。',
                        required: true,
                    },
                ],
            },
            {
                name: 'delete',
                type: 1, 
                description: '設定された時報を削除します。',
            },
        ],
    },
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            const file = path.join(__dirname, '../time-signal-channels.json');
            let data = {};
            if (fs.existsSync(file)) {
                const fileContent = fs.readFileSync(file);
                data = JSON.parse(fileContent);
            }
            data[interaction.guildId] = channel.id;
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            await interaction.reply(`時報を ${channel} に設定しました。`);
        } else if (subcommand === 'delete') {
            const file = path.join(__dirname, '../time-signal-channels.json');
            const fileContent = fs.readFileSync(file);
            const data = JSON.parse(fileContent);
            if (!data[interaction.guildId]) {
                await interaction.reply('設定された時報はありません。');
                return;
            }
            delete data[interaction.guildId];
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            await interaction.reply('設定された時報を削除しました。');
        }
    },
}