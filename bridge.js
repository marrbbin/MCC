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
    const chatString = `${message.author.username}: ${message.content}`;
    console.log(`Forwarding: ${chatString}`);
    wss.clients.forEach((mcClient) => {
        if (mcClient.readyState === WebSocket.OPEN) {
            mcClient.send(chatString);
        }
    });
});

client.once('ready', () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}!`);
});

client.login('MTUwMTMwMTE5MTA1MTg0MTYyNg.GhTijM.hQODSELpLt3AYjZJRmBRHRCYAh0xx1NqdQNPJk');
