
const { Client, GatewayIntentBits, PresenceUpdateStatus, ActivityType, MessageFlags, PermissionsBitField, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Partials } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const path = require("path");
// Load environment variables from .env file
config();

// Create a new Discord client instance
const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// コマンドの登録
client.commands = new Map();
const commandsPath = path.join(__dirname, 'command');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        // メモリに登録（client.applicationはreadyになるまでnullなので直接参照しない）
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// interactionCreateの処理
client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`[${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}] Executed ${interaction.commandName} command. By ${interaction.channelId} in ${interaction.guildId} from ${interaction.user.tag}`);
        } catch (error) {
            console.error(`[${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}] Error executing ${interaction.commandName}`);
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
});

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        const commandsArray = Array.from(client.commands.values()).map(cmd => cmd.data);
        if (commandsArray.length > 0) {
            await client.application.commands.set(commandsArray);
            console.log(`Registered ${commandsArray.length} application commands.`);
        }
    } catch (err) {
        console.error('Failed to register application commands:', err);
    }
});

client.on('clientReady', async () => {
    setInterval(() => {
        const activities = [
            { name: 'PiriBot v2', type: ActivityType.Custom },
            { name: 'Discord.js v14', type: ActivityType.Custom },
            { name: `Ping: ${client.ws.ping}ms`, type: ActivityType.Custom },
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity);
    }, 60 * 1000); // 1分ごとにステータスを更新
});

client.login(process.env.DISCORD_TOKEN);