function getRandomMessage({list, mention, server, userTag}){
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex].replace('${mention}', `<@${mention}>`).replace('${server}', server).replace('${userTag}', userTag);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {getRandomMessage, delay}