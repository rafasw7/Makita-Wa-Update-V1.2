const { enviar, reagir, enviarimagem } = require("./mensagens")
const { info, erro, logMessage } = require("./loggers")
const { getGrupoConfig, setGrupoConfig, isGroupAdm, isBotAdm, isGroup, containsLink, containsMentionAll, isFakeNumber } = require("./grupo")
const config = require("../configurar/dados.json")

async function handleGroupProtection(makitawa, m, jid, fromMe, body) {
    if (isGroup(jid) && !fromMe) {
        const grupoConfig = getGrupoConfig(jid)
        const userParticipant = m.key.participant || jid
        
        if (!await isGroupAdm(makitawa, jid, userParticipant)) {
            await handleAntiLink(makitawa, m, jid, userParticipant, grupoConfig, body)
            await handleAntiMedia(makitawa, m, jid, userParticipant, grupoConfig)
            await handleAntiMencao(makitawa, m, jid, userParticipant, grupoConfig, body)
            await handleAntiChatStatus(makitawa, m, jid, userParticipant, grupoConfig)
        }
    }
}

async function handleAntiLink(makitawa, m, jid, userParticipant, grupoConfig, body) {
    if (grupoConfig.antiLink && containsLink(body)) {
        if (!await isBotAdm(makitawa, jid, m)) return
        try {
            await makitawa.sendMessage(jid, { delete: m.key })
            const mensagemAlerta = `❌ @${userParticipant.split('@')[0]}, links não são permitidos neste grupo!`
            await makitawa.sendMessage(jid, { 
                text: mensagemAlerta, 
                mentions: [userParticipant] 
            })
            await reagir(makitawa, jid, m, "❌")
            return true
        } catch (error) {
            erro(`Erro ao deletar mensagem com link: ${error.message}`)
        }
    }
    return false
}

async function handleAntiMedia(makitawa, m, jid, userParticipant, grupoConfig) {
    const mediaHandlers = [
        { type: 'audioMessage', config: 'antiAudio', message: 'áudios' },
        { type: 'videoMessage', config: 'antiVideo', message: 'vídeos' },
        { type: 'documentMessage', config: 'antiDoc', message: 'documentos' },
        { type: 'stickerMessage', config: 'antiSticker', message: 'stickers' },
        { type: 'imageMessage', config: 'antiFoto', message: 'fotos' }
    ]

    for (const handler of mediaHandlers) {
        if (grupoConfig[handler.config] && m.message[handler.type]) {
            if (!await isBotAdm(makitawa, jid, m)) return
            try {
                await makitawa.sendMessage(jid, { delete: m.key })
                await makitawa.sendMessage(jid, { 
                    text: `❌ @${userParticipant.split('@')[0]}, ${handler.message} não são permitidos neste grupo!`, 
                    mentions: [userParticipant] 
                })
                await reagir(makitawa, jid, m, "❌")
                return true
            } catch (error) {
                erro(`Erro ao deletar ${handler.message}: ${error.message}`)
            }
        }
    }
    return false
}

async function handleAntiMencao(makitawa, m, jid, userParticipant, grupoConfig, body) {
    if (grupoConfig.antiMencao && containsMentionAll(body)) {
        if (!await isBotAdm(makitawa, jid, m)) return
        try {
            await makitawa.sendMessage(jid, { delete: m.key })
            await makitawa.sendMessage(jid, { 
                text: `❌ @${userParticipant.split('@')[0]}, menções a todos não são permitidas neste grupo!`, 
                mentions: [userParticipant] 
            })
            await reagir(makitawa, jid, m, "❌")
            return true
        } catch (error) {
            erro(`Erro ao deletar menção: ${error.message}`)
        }
    }
    return false
}

async function handleAntiChatStatus(makitawa, m, jid, userParticipant, grupoConfig) {
    const hasStatusMessage = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.groupStatusMentionMessage || 
                           m.message.groupStatusMentionMessage
    
    if (grupoConfig.antiChatStatus && hasStatusMessage) {
        if (!await isBotAdm(makitawa, jid, m)) return
        try {
            await makitawa.sendMessage(jid, { delete: m.key })
            await makitawa.sendMessage(jid, { 
                text: `❌ @${userParticipant.split('@')[0]}, mensagens de status não são permitidas neste grupo!`, 
                mentions: [userParticipant] 
            })
            await reagir(makitawa, jid, m, "❌")
            return true
        } catch (error) {
            erro(`Erro ao deletar mensagem de status: ${error.message}`)
        }
    }
    return false
}

async function handleGroupParticipantsUpdate(makitawa, update) {
    try {
        const { id, participants, action } = update
        
        if (action === "add") {
            const grupoConfig = getGrupoConfig(id)
            
            for (const participant of participants) {
                try {
                    const participantJid = typeof participant === 'string' ? participant : participant.id
                    
                    if (grupoConfig.antiFake && isFakeNumber(participantJid)) {
                        if (!await isBotAdm(makitawa, id)) return
                        
                        await makitawa.groupParticipantsUpdate(id, [participantJid], "remove")
                        await makitawa.sendMessage(id, {
                            text: `⚠️ Número internacional detectado e removido: @${participantJid.split('@')[0]}`,
                            mentions: [participantJid]
                        })
                        continue
                    }
                    
                    if (grupoConfig.boasVindas) {
                        if (!await isBotAdm(makitawa, id)) return
                        
                        const numeroParticipante = participantJid.split('@')[0]
                        const profilePic = await makitawa.profilePictureUrl(participantJid, "image").catch(() => null)
                        const welcomeMsg = grupoConfig.welcomeMessage.replace("@user", `@${numeroParticipante}`)
                        
                        if (profilePic) {
                            await makitawa.sendMessage(id, {
                                image: { url: profilePic },
                                caption: welcomeMsg,
                                mentions: [participantJid]
                            })
                        } else {
                            await makitawa.sendMessage(id, {
                                text: welcomeMsg,
                                mentions: [participantJid]
                            })
                        }
                    }
                } catch (error) {
                    erro(`Erro ao processar participante: ${error.message}`)
                }
            }
        }
    } catch (error) {
        erro(`Erro no evento group-participants: ${error.message}`)
    }
}

module.exports = {
    handleGroupProtection,
    handleAntiLink,
    handleAntiMedia,
    handleAntiMencao,
    handleAntiChatStatus,
    handleGroupParticipantsUpdate
}