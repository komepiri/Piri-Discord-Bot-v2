// make it quoteの画像生成
const generateMiqImages = require('../generate-miq');

module.exports = {
    data: {
        name: 'Make it a Quoteの作成(カラー)',
        type: 3
    },
    async execute(interaction) {
        const targetMessage = await interaction.channel.messages.fetch(interaction.targetId);
        const username = targetMessage.author.username;
        const displayName = targetMessage.author.displayName;
        const text = targetMessage.content;
        const avatarUrl = targetMessage.author.displayAvatarURL({ format: 'png', size: 128 });
        const color = true;
        const imageUrl = await generateMiqImages.generateMiqImages(username, displayName, text, avatarUrl, color);
        await interaction.reply({ files: [{ attachment: imageUrl }] });
    },
};