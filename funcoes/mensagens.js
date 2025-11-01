const { erro } = require("./loggers")

const enviar = async (makitawa, jid, m, conteudo, options = {}) => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        await new Promise((r) => setTimeout(r, 1000))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        
        const mensagemOptions = {
            text: conteudo,
            contextInfo,
            ...options
        }
        
        const mensagem = await makitawa.sendMessage(jid, mensagemOptions)
        return mensagem
    } catch (error) {
        erro(`Erro ao enviar mensagem: ${error.message}`)
    }
}

const enviarimagem = async (makitawa, jid, m, url, caption = "") => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            image: { url },
            caption,
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar imagem: ${error.message}`)
    }
}

const enviarvideo = async (makitawa, jid, m, url, caption = "") => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            video: { url },
            caption,
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar vídeo: ${error.message}`)
    }
}

const enviaraudio = async (makitawa, jid, m, url) => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("recording", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            audio: { url },
            mimetype: "audio/mp4",
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar áudio: ${error.message}`)
    }
}

const enviardocumento = async (makitawa, jid, m, url, filename, caption = "") => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            document: { url },
            fileName: filename,
            caption,
            mimetype: "application/octet-stream",
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar documento: ${error.message}`)
    }
}

const enviarsticker = async (makitawa, jid, m, url) => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            sticker: { url },
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar sticker: ${error.message}`)
    }
}

const enviarlocalizacao = async (makitawa, jid, m, latitude, longitude, nome, endereco) => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            location: {
                degreesLatitude: latitude,
                degreesLongitude: longitude,
                name: nome,
                address: endereco,
            },
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar localização: ${error.message}`)
    }
}

const enviarcontato = async (makitawa, jid, m, numero, nome) => {
    try {
        if (!jid) throw new Error("jid inválido")
        await makitawa.sendPresenceUpdate("composing", jid)
        const delay = 500 + Math.floor(Math.random() * 1500)
        await new Promise((r) => setTimeout(r, delay))
        const contextInfo = m?.key ? {
            stanzaId: m.key.id,
            participant: m.key.participant || m.key.remoteJid,
            quotedMessage: m.message,
        } : undefined
        await makitawa.sendMessage(jid, {
            contacts: {
                contacts: [{
                    displayName: nome,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${nome}\nTEL;type=CELL;type=VOICE;waid=${numero}:${numero}\nEND:VCARD`
                }]
            },
            contextInfo,
        })
    } catch (error) {
        erro(`Erro ao enviar contato: ${error.message}`)
    }
}

const reagir = async (makitawa, jid, m, emoji) => {
    try {
        if (!jid) throw new Error("jid inválido")
        if (!m?.key) throw new Error("mensagem inválida")
        await makitawa.sendMessage(jid, {
            react: {
                text: emoji,
                key: m.key,
            },
        })
    } catch (error) {
        erro(`Erro ao reagir: ${error.message}`)
    }
}

const marcar = (jid) => {
    return `@${jid.split("@")[0]}`
}

const nome = (m) => {
    return m?.pushName || "Usuário"
}

module.exports = {
    enviar,
    enviarimagem,
    enviarvideo,
    enviaraudio,
    enviardocumento,
    enviarsticker,
    enviarlocalizacao,
    enviarcontato,
    reagir,
    marcar,
    nome
}