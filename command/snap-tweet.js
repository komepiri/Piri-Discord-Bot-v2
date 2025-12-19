const { MessageFlags } = require('discord.js');
const { getSnapAppRender } = require('twitter-snap')
const fs = require('fs');
module.exports = {
    data: {
        name: 'snap-tweet',
        description: '指定したツイートのスクリーンショットを撮影して送信します。',
        options: [
            {
                type: 3, 
                name: 'url',
                description: 'スクリーンショットを撮影するツイートのURLを入力してください。',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const tweetUrl = interaction.options.getString('url');

        // ツイートURLを正規表現で判定 by gh copilot
        const tweetUrlPattern = /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/;
        if (!tweetUrlPattern.test(tweetUrl)) {
            await interaction.reply({ content: '有効なツイートのURLを入力してください。', flags: MessageFlags.Ephemeral });
            return;
        }

        await interaction.deferReply();

        try {
            const snap = getSnapAppRender({ url: tweetUrl});
            const font = await snap.getFont()
            const session = await snap.login({sessionType: 'guest'})
            const render = await snap.getRender({limit: 1, session})
            const res = await new Promise((resolve, reject) => {
                snap.run(render, async (run) => {
                    try {
                        const result = await run({
                            width: 650,
                            theme: 'RenderOceanBlueColor',
                            font,
                            output: 'tweet-image/{id}-{count}.png',
                        });
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            await interaction.editReply({ files: [{ attachment: fs.createReadStream(res.file.path.toString()), name: 'tweet-screenshot.png' }] });
        } catch (error) {
            console.error('[TweetSnap] Error capturing tweet screenshot:', error);
            await interaction.editReply({ content: 'ツイートのスクリーンショットの取得中にエラーが発生しました。' });
        }
    }
}