function testWelcomeMessage(client) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const fakeMember = {
        id: '123456789012345678',
        user: { tag: 'FakeUser#0000' },
        guild: guild,
        toString: function () { return `<@${this.id}>`; }
    };
    if (!guild) {
        console.log('Guild not found');
        return;
    }

    client.emit('guildMemberAdd', fakeMember);
}

function testLeaveMessage(client) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const fakeMember = {
        id: '123456789012345678',
        user: { tag: 'FakeUser#0000' },
        guild: guild,
        toString: function () { return `<@${this.id}>`; }
    };
    if (!guild) {
        console.log('Guild not found');
        return;
    }

    client.emit('guildMemberRemove', fakeMember);
}

module.exports = {testLeaveMessage, testWelcomeMessage}