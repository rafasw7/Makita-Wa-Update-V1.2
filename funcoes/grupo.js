const fs = require("fs")
const path = require("path")
const { enviar } = require("./mensagens")

const gruposDir = path.join(__dirname, "..", "registros", "grupos")

function garantirDiretorioGrupo(jid) {
    if (!fs.existsSync(gruposDir)) fs.mkdirSync(gruposDir, { recursive: true })
    const grupoFile = path.join(gruposDir, `${jid}.json`)
    if (!fs.existsSync(grupoFile)) {
        fs.writeFileSync(
            grupoFile,
            JSON.stringify(
                {
                    boasVindas: false,
                    antiLink: false,
                    antiAudio: false,
                    antiVideo: false,
                    antiDoc: false,
                    antiSticker: false,
                    antiChatStatus: false,
                    antiFoto: false,
                    antiMencao: false,
                    antiFake: false,
                    welcomeMessage: "🎉 Bem-vindo(a) ao grupo, @user!",
                    welcomeImage: "https://files.nexhub.fun/api/uploads/cf576149-0913-4e4e-817d-eb9ced49d5b9/image/3e077240-6c43-4144-821d-d02cf11b71d3.jpg",
                },
                null,
                2
            )
        )
    }
    return grupoFile
}

function getGrupoConfig(jid) {
    const grupoFile = garantirDiretorioGrupo(jid)
    return JSON.parse(fs.readFileSync(grupoFile, "utf8"))
}

function setGrupoConfig(jid, config) {
    const grupoFile = garantirDiretorioGrupo(jid)
    fs.writeFileSync(grupoFile, JSON.stringify(config, null, 2))
}

async function isGroupAdm(makitawa, jid, participant, m = null) {
    try {
        const groupMetadata = await makitawa.groupMetadata(jid)
        const admins = groupMetadata.participants.filter((p) => p.admin).map((p) => p.id)
        const isAdmin = admins.includes(participant)
        
        if (!isAdmin && m) {
            await enviar(makitawa, jid, m, "❌ Apenas administradores podem usar este comando.")
        }
        
        return isAdmin
    } catch {
        if (m) {
            await enviar(makitawa, jid, m, "❌ Erro ao verificar permissões de administrador.")
        }
        return false
    }
}

async function isBotAdm(makitawa, jid, m = null) {
    try {
        const groupMetadata = await makitawa.groupMetadata(jid)
        const botJid = makitawa.user.id
        const normalizarJid = (id) => {
            if (!id) return ""
            const normalizado = id
                .replace(/:.*/, "")
                .replace(/@s\.whatsapp\.net$/, "")
                .replace(/@lid$/, "")
                .replace(/^lid:/, "")
            return normalizado
        }

        const botIdNormalizado = normalizarJid(botJid)

        const participanteBot = groupMetadata.participants.find((p) => {
            const participanteId = normalizarJid(p.id)
            const participantePhone = normalizarJid(p.phoneNumber)
            return (
                participanteId === botIdNormalizado ||
                participantePhone === botIdNormalizado
            )
        })

        if (!participanteBot) {
            if (m) await enviar(makitawa, jid, m, "❌ Bot não encontrado no grupo.")
            return false
        }

        const isAdmin = !!participanteBot.admin

        if (!isAdmin && m) {
            await enviar(makitawa, jid, m, "❌ Preciso ser administrador para executar esta ação!")
        }

        return isAdmin
    } catch (e) {
        console.error("Erro ao verificar permissões:", e)
        if (m) await enviar(makitawa, jid, m, "❌ Erro ao verificar permissões do bot.")
        return false
    }
}

function isGroup(jid, makitawa = null, m = null) {
    const isGp = jid.endsWith("@g.us")
    
    if (!isGp && makitawa && m) {
        enviar(makitawa, jid, m, "❌ Este comando só funciona em grupos.")
    }
    
    return isGp
}

function containsLink(text) {
    if (!text) return false
    
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/gi
    const links = text.match(linkRegex)
    
    if (!links) return false
    
    return links.length > 0
}

function containsMentionAll(message, groupMetadata) {
    if (!message || !message.contextInfo || !groupMetadata) return false

    const mentions = message.contextInfo.mentionedJid || []
    const totalParticipantes = groupMetadata.participants.length

    return mentions.length === totalParticipantes
}

function isFakeNumber(jid) {
    const numero = jid.split('@')[0]
    return !numero.startsWith('55')
}

module.exports = {
    getGrupoConfig,
    setGrupoConfig,
    isGroupAdm,
    isBotAdm,
    isGroup,
    containsLink,
    containsMentionAll,
    isFakeNumber
}