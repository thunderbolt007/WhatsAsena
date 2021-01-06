const Asena = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');

Asena.addCommand({pattern: 'audio', fromMe: false, desc: "Video to audio converter"}, (async (message, match) => {
    if (message.reply_message === false) return await message.sendMessage('*Respond to a Video File!*');
    if (!message.reply_message.video) return await message.sendMessage('*Respond to a Video File.*');
    var downloading = await message.client.sendMessage(message.jid,'```Video to audio converter..```',MessageType.text);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    ffmpeg(location)
        .withNoVideo()
        .save('convert.mp3')
        .on('end', async () => {
            await message.sendMessage(fs.readFileSync('convert.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: false});
        });
    return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})
}));
