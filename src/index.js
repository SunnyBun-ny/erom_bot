require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { getRandomMessage, delay } = require('./helpers.js');
const listOfWelcomeMessages = require('./data/listOfWelcomeMessages.js');
const listOfLeaveMessages = require('./data/listOfLeaveMessages.js');
const {testLeaveMessage, testWelcomeMessage} = require('./test/testMemberGreetings.js');
const connectToMongo = require('./db.js');

connectToMongo();


// const client = new Client({
//     intents: [
//         IntentsBitField.Flags.Guilds,
//         IntentsBitField.Flags.GuildMembers,
//         IntentsBitField.Flags.GuildMessages
//     ]
// });

// client.on('ready', async (c) => {
//     console.log('The bot is ready!');

//     // testWelcomeMessage(client);
//     // await delay(5000);
//     // testLeaveMessage(client);

// });

// client.on('guildMemberAdd', member => {
//     const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
//     if (!channel) return;
//     var message = getRandomMessage({ list: listOfWelcomeMessages, mention: member.id, server: member.guild.name });
//     channel.send(message);
// });

// client.on('guildMemberRemove', member => {
//     const channel = member.guild.channels.cache.get(process.env.LEAVE_CHANNEL_ID);
//     if (!channel) return;
//     var message = getRandomMessage({ list: listOfLeaveMessages, userTag: member.user.tag });
//     channel.send(message);
// })

// client.login(process.env.BOT_ACCESS_TOKEN);





