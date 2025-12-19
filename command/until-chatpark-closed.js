module.exports = {
    data: {
        name: 'until-chatpark-closed',
        description: 'チャット広場が閉鎖されるまでの残り時間を表示します。',
    },
    async execute(interaction) {
        const targetDate = new Date('2025-12-31T23:59:59Z'); // ChatPark閉鎖日時
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            await interaction.reply('チャット広場は閉鎖しました。さようなら！チャット広場！');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        await interaction.reply(`チャット広場が閉鎖されるまで、あと ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒です。\n-# カウントダウンは技術的には可能です`);
    }
}