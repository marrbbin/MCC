const { Client, GatewayIntentBits } = require('discord.js');
const WebSocket = require('ws');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });

wss.on('connection', (ws) => {
    console.log('✅ ComputerCraft Monitor connected!');
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // ONLY forward if the channel name is chika-chika
    if (message.channel.name === 'chika-chika') {
        const chatString = `${message.author.username}: ${message.content}`;
        wss.clients.forEach((mcClient) => {
            if (mcClient.readyState === WebSocket.OPEN) {
                mcClient.send(chatString);
            }
        });
    }
});

client.once('ready', () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}!`);
});


// This tells the bot to look for the token in the server's "hidden" settings
client.login(process.env.DISCORD_TOKEN);
