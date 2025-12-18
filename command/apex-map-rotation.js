module.exports = {
    data: {
        name: 'apex-map-rotation',
        description: 'Apex Legendsの現在のマップローテーション情報を取得します。',
    },
    async execute(interaction) {
        fetch ('https://api.mozambiquehe.re/maprotation?auth=' + process.env.APEX_API_KEY + '&version=2')
        .then(response => response.json())
        .then(async data => {
            const currentUnRankedMap = data.battle_royale.current;
            const nextUnRankedMap = data.battle_royale.next;
            const currentRankedMap = data.ranked.current;
            const nextRankedMap = data.ranked.next;
            
            const embed = {
                title: 'Apex Legends マップローテーション一覧',
                color: 0xff6600,
                fields: [
                    {
                        name: '現在の通常マップ',
                        value: `${currentUnRankedMap.map} (残り時間: ${currentUnRankedMap.remainingTimer})`,
                    },
                    {
                        name: '次の通常マップ',
                        value: `${nextUnRankedMap.map} (開始日時: ${new Date(nextUnRankedMap.start * 1000).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })})`,
                    },
                    {
                        name: '現在のランクマッチマップ',
                        value: `${currentRankedMap.map} (残り時間: ${currentRankedMap.remainingTimer})`,
                    },
                    {
                        name: '次のランクマッチマップ',
                        value: `${nextRankedMap.map} (開始日時: ${new Date(nextRankedMap.start * 1000).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })})`,
                    },
                ],
                timestamp: new Date(),
            };
            await interaction.reply({ embeds: [embed] });
        })
        .catch(async error => {
            console.error('Error fetching Apex Legends map rotation data:', error);
            await interaction.reply('Apex Legendsのマップローテーション情報の取得中にエラーが発生しました。');
        });
    },
}