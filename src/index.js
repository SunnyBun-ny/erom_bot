require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages
    ]
});

client.on('ready', (c)=>console.log('The bot is ready!'));

client.login(process.env.BOT_ACCESS_TOKEN);


