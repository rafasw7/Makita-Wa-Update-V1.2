const { handleGroupProtection, handleGroupParticipantsUpdate } = require("./funcoes/eventos")
const { enviar, reagir, enviarimagem, enviarsticker } = require("./funcoes/mensagens")
const { info, erro, logMessage } = require("./funcoes/loggers")
const { getGrupoConfig, setGrupoConfig, isGroupAdm, isBotAdm, isGroup } = require("./funcoes/grupo")
const config = require("./configurar/dados.json")
const os = require('os')
const process = require('process')
const util = require('util')
const { prefixo } = require("./configurar/dados.json")
const fs = require('fs')

if (!fs.existsSync('./temp')) {
    fs.mkdirSync('./temp', { recursive: true })
}

module.exports = async (makitawa, prefixo) => {
    makitawa.ev.on("messages.upsert", async (msgUpdate) => {
        try {
            const m = msgUpdate.messages[0]
            if (!m.message || !m.key?.remoteJid) return

            const jid = m.key.remoteJid
            const fromMe = m.key.fromMe
            if (fromMe) return

            const body = m.message.conversation ||
                m.message.extendedTextMessage?.text ||
                m.message.imageMessage?.caption || ""

            const args = body.startsWith(prefixo) ? body.trim().split(/\s+/) : []
            const comando = body.startsWith(prefixo) ? args[0].slice(prefixo.length).toLowerCase() : ""
            const texto = args.slice(1).join(" ")

            const tipoChat = jid.endsWith("@g.us") ? "GRUPO" : "PESSOAL"
            const hora = new Date().toLocaleTimeString()
            const nome = m.pushName || m.key.participant || "Desconhecido"
            const numero = jid.replace("@s.whatsapp.net", "")
            const lid = m.key.id
            const midia = m.message.imageMessage ? "IMAGEM" :
                m.message.videoMessage ? "VÍDEO" :
                m.message.audioMessage ? "ÁUDIO" :
                m.message.documentMessage ? "DOCUMENTO" :
                m.message.stickerMessage ? "STICKER" :
                m.message.contactMessage ? "CONTATO" :
                m.message.locationMessage ? "LOCALIZAÇÃO" :
                m.message.groupStatusMentionMessage ? "STATUS_CHAT" :
                m.message.conversation || m.message.extendedTextMessage ? "TEXTO" : "-"
            const isComando = body.startsWith(config.prefixo)

            logMessage({ nome, numero, lid, tipoChat, hora, mensagem: body, midia, comando: isComando })
            
            await handleGroupProtection(makitawa, m, jid, fromMe, body)
            
            switch (comando) {
                case "ping":
                    await reagir(makitawa, jid, m, "🏓")
                    const inicio = Date.now()
                    const mensagemPing = await enviar(makitawa, jid, m, "🏓 *Pong!*")
                    const fim = Date.now()
                    const latencia = fim - inicio
                    await makitawa.sendMessage(jid, {
                        text: `🏓 *Pong!*\n📡 *Latência:* ${latencia}ms\n💻 *Uptime:* ${Math.floor(process.uptime())}s`,
                        edit: mensagemPing.key
                    })
                    break

                case "menu":
                    await reagir(makitawa, jid, m, "🤓")
                    const menuImage = "https://files.nexhub.fun/api/uploads/cf576149-0913-4e4e-817d-eb9ced49d5b9/image/ff99fbf0-052d-408a-b818-1eb800ab7ccd.jpg"
                    const menuCaption = `
🐬 • Makita Base - \`New Update\`
• Boas-vindas à atualização 1.2 do Makita Bot Base. Com isso, melhorias foram feitas, desde a conexão até os comandos. Bom aproveito! 🤠

🐬 • Simple for Users:
> Utilitários
• *${prefixo}*\`ping\`
• *${prefixo}*\`s\`
• *${prefixo}*\`attp\`

🐬 • For Entertainment: 
> Brincadeiras
• *${prefixo}*\`ppt\`

🐬 • Specifically for Administrators:
> Administração
• *${prefixo}*\`antilink\`
• *${prefixo}*\`boasvindas\`
• *${prefixo}*\`antiaudio\`
• *${prefixo}*\`antivideo\`
• *${prefixo}*\`antidoc\`
• *${prefixo}*\`antisticker\`
• *${prefixo}*\`antichatstatus\`
• *${prefixo}*\`antifoto\`
• *${prefixo}*\`antimencao\`
• *${prefixo}*\`antifake\`
• *${prefixo}*\`apagar\`
• *${prefixo}*\`ban\`
• *${prefixo}*\`grupo\`

> \`Created By @rafasw7\`
`
                    await enviarimagem(makitawa, jid, m, menuImage, menuCaption.trim())
                    break

                case "boasvindas":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantBoasVindas = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantBoasVindas, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfig = getGrupoConfig(jid)
                    grupoConfig.boasVindas = !grupoConfig.boasVindas
                    setGrupoConfig(jid, grupoConfig)
                    await reagir(makitawa, jid, m, grupoConfig.boasVindas ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🤓 Boas-vindas ${grupoConfig.boasVindas ? "ativadas" : "desativadas"}!`)
                    break

                case "antilink":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntilink = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntilink, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntilink = getGrupoConfig(jid)
                    grupoConfigAntilink.antiLink = !grupoConfigAntilink.antiLink
                    setGrupoConfig(jid, grupoConfigAntilink)
                    await reagir(makitawa, jid, m, grupoConfigAntilink.antiLink ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🚫 Anti-link ${grupoConfigAntilink.antiLink ? "ativado" : "desativado"}!`)
                    break

                case "antiaudio":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntiaudio = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntiaudio, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntiaudio = getGrupoConfig(jid)
                    grupoConfigAntiaudio.antiAudio = !grupoConfigAntiaudio.antiAudio
                    setGrupoConfig(jid, grupoConfigAntiaudio)
                    await reagir(makitawa, jid, m, grupoConfigAntiaudio.antiAudio ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🎵 Anti-áudio ${grupoConfigAntiaudio.antiAudio ? "ativado" : "desativado"}!`)
                    break

                case "antivideo":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntivideo = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntivideo, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntivideo = getGrupoConfig(jid)
                    grupoConfigAntivideo.antiVideo = !grupoConfigAntivideo.antiVideo
                    setGrupoConfig(jid, grupoConfigAntivideo)
                    await reagir(makitawa, jid, m, grupoConfigAntivideo.antiVideo ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🎬 Anti-vídeo ${grupoConfigAntivideo.antiVideo ? "ativado" : "desativado"}!`)
                    break

                case "antidoc":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntidoc = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntidoc, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntidoc = getGrupoConfig(jid)
                    grupoConfigAntidoc.antiDoc = !grupoConfigAntidoc.antiDoc
                    setGrupoConfig(jid, grupoConfigAntidoc)
                    await reagir(makitawa, jid, m, grupoConfigAntidoc.antiDoc ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `📄 Anti-documento ${grupoConfigAntidoc.antiDoc ? "ativado" : "desativado"}!`)
                    break

                case "antisticker":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntisticker = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntisticker, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntisticker = getGrupoConfig(jid)
                    grupoConfigAntisticker.antiSticker = !grupoConfigAntisticker.antiSticker
                    setGrupoConfig(jid, grupoConfigAntisticker)
                    await reagir(makitawa, jid, m, grupoConfigAntisticker.antiSticker ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🩵 Anti-sticker ${grupoConfigAntisticker.antiSticker ? "ativado" : "desativado"}!`)
                    break

                case "antichatstatus":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntichatstatus = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntichatstatus, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntichatstatus = getGrupoConfig(jid)
                    grupoConfigAntichatstatus.antiChatStatus = !grupoConfigAntichatstatus.antiChatStatus
                    setGrupoConfig(jid, grupoConfigAntichatstatus)
                    await reagir(makitawa, jid, m, grupoConfigAntichatstatus.antiChatStatus ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `📱 Anti-chat-status ${grupoConfigAntichatstatus.antiChatStatus ? "ativado" : "desativado"}!`)
                    break

                case "antifoto":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntifoto = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntifoto, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntifoto = getGrupoConfig(jid)
                    grupoConfigAntifoto.antiFoto = !grupoConfigAntifoto.antiFoto
                    setGrupoConfig(jid, grupoConfigAntifoto)
                    await reagir(makitawa, jid, m, grupoConfigAntifoto.antiFoto ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🖼️ Anti-foto ${grupoConfigAntifoto.antiFoto ? "ativada" : "desativada"}!`)
                    break

                case "antimencao":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntimencao = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntimencao, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntimencao = getGrupoConfig(jid)
                    grupoConfigAntimencao.antiMencao = !grupoConfigAntimencao.antiMencao
                    setGrupoConfig(jid, grupoConfigAntimencao)
                    await reagir(makitawa, jid, m, grupoConfigAntimencao.antiMencao ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `@ Anti-menção ${grupoConfigAntimencao.antiMencao ? "ativada" : "desativada"}!`)
                    break

                case "antifake":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantAntifake = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantAntifake, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    const grupoConfigAntifake = getGrupoConfig(jid)
                    grupoConfigAntifake.antiFake = !grupoConfigAntifake.antiFake
                    setGrupoConfig(jid, grupoConfigAntifake)
                    await reagir(makitawa, jid, m, grupoConfigAntifake.antiFake ? "✅" : "❌")
                    await enviar(makitawa, jid, m, `🌍 Anti-fake ${grupoConfigAntifake.antiFake ? "ativado" : "desativado"}!`)
                    break

                case "apagar":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantApagar = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantApagar, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    
                    if (m.message.extendedTextMessage?.contextInfo?.stanzaId) {
                        const quotedKey = {
                            remoteJid: jid,
                            id: m.message.extendedTextMessage.contextInfo.stanzaId,
                            participant: m.message.extendedTextMessage.contextInfo.participant
                        }
                        await makitawa.sendMessage(jid, { delete: quotedKey })
                        await reagir(makitawa, jid, m, "✅")
                    } else {
                        await enviar(makitawa, jid, m, "❌ Marque uma mensagem para apagar.")
                    }
                    break

                case "ban":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantBan = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantBan, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    
                    let targetUser = null
                    
                    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                        targetUser = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
                    } else if (m.message.extendedTextMessage?.contextInfo?.participant) {
                        targetUser = m.message.extendedTextMessage.contextInfo.participant
                    } else if (texto) {
                        targetUser = texto.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    }
                    
                    if (targetUser) {
                        await makitawa.groupParticipantsUpdate(jid, [targetUser], "remove")
                        await reagir(makitawa, jid, m, "✅")
                        await enviar(makitawa, jid, m, `🚫 Usuário removido.`)
                    } else {
                        await enviar(makitawa, jid, m, "❌ Marque o usuário ou mencione com @ para remover.")
                    }
                    break

                case "grupo":
                    if (!isGroup(jid, makitawa, m)) return
                    const userParticipantGrupo = m.key.participant || jid
                    if (!await isGroupAdm(makitawa, jid, userParticipantGrupo, m)) return
                    if (!await isBotAdm(makitawa, jid, m)) return
                    
                    if (texto === "a" || texto === "abre") {
                        const groupMetadata = await makitawa.groupMetadata(jid)
                        if (!groupMetadata.announce) {
                            await enviar(makitawa, jid, m, "❌ O grupo já está aberto.")
                        } else {
                            await makitawa.groupSettingUpdate(jid, 'not_announcement')
                            await reagir(makitawa, jid, m, "✅")
                            await enviar(makitawa, jid, m, "🔓 Grupo aberto com sucesso!")
                        }
                    } else if (texto === "f" || texto === "fecha") {
                        const groupMetadata = await makitawa.groupMetadata(jid)
                        if (groupMetadata.announce) {
                            await enviar(makitawa, jid, m, "❌ O grupo já está fechado.")
                        } else {
                            await makitawa.groupSettingUpdate(jid, 'announcement')
                            await reagir(makitawa, jid, m, "✅")
                            await enviar(makitawa, jid, m, "🔒 Grupo fechado com sucesso!")
                        }
                    } else {
                        await enviar(makitawa, jid, m, "❌ Use: *grupo a* para abrir ou *grupo f* para fechar")
                    }
                    break
                    
                case "ppt":
                    try {
                        await reagir(makitawa, jid, m, "🎮")
                        
                        const escolhas = ["pedra", "papel", "tesoura"]
                        const escolhaBot = escolhas[Math.floor(Math.random() * escolhas.length)]
                        
                        const userChoice = texto.toLowerCase()
                        
                        if (!escolhas.includes(userChoice)) {
                            await enviar(makitawa, jid, m, `🎮 *Pedra, Papel ou Tesoura?*\n\nUse: ${prefixo}ppt pedra\n${prefixo}ppt papel\n${prefixo}ppt tesoura`)
                            return
                        }
                        
                        let resultado = ""
                        let emojiResult = ""
                        
                        if (userChoice === escolhaBot) {
                            resultado = "EMPATE!"
                            emojiResult = "🤝"
                        } else if (
                            (userChoice === "pedra" && escolhaBot === "tesoura") ||
                            (userChoice === "papel" && escolhaBot === "pedra") ||
                            (userChoice === "tesoura" && escolhaBot === "papel")
                        ) {
                            resultado = "VOCÊ GANHOU! 🎉"
                            emojiResult = "🏆"
                        } else {
                            resultado = "EU GANHEI! 😎"
                            emojiResult = "🤖"
                        }
                        
                        const emojis = {
                            pedra: "🪨",
                            papel: "📄", 
                            tesoura: "✂️"
                        }
                        
                        const pptMessage = `
🎮 *PEDRA, PAPEL OU TESOURA*

👤 *Sua escolha:* ${emojis[userChoice]} ${userChoice.toUpperCase()}
🤖 *Minha escolha:* ${emojis[escolhaBot]} ${escolhaBot.toUpperCase()}

${emojiResult} *Resultado:* ${resultado}
                        `.trim()
                        
                        await enviar(makitawa, jid, m, pptMessage)
                        
                    } catch (error) {
                        erro(`Erro no comando ppt: ${error.message}`)
                        await enviar(makitawa, jid, m, "❌ Erro ao jogar pedra, papel e tesoura.")
                    }
                    break
                
                case "s":
                    try {
                        await reagir(makitawa, jid, m, "⏳")
                        const fs = require("fs")
                        const { execSync } = require("child_process")
                        const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

                        let mediaMessage = null
                        if (m.message.imageMessage) mediaMessage = m.message.imageMessage
                        else if (m.message.videoMessage) mediaMessage = m.message.videoMessage
                        else if (m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)
                            mediaMessage = m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
                        else if (m.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage)
                            mediaMessage = m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage

                        if (!mediaMessage) {
                            await enviar(makitawa, jid, m, "❌ Envie ou marque uma imagem/vídeo pra criar o sticker.")
                            return
                        }

                        if (mediaMessage.seconds && mediaMessage.seconds > 9) {
                            await enviar(makitawa, jid, m, "❌ O vídeo deve ter no máximo 9 segundos.")
                            return
                        }

                        const stream = await downloadContentFromMessage(
                            mediaMessage,
                            mediaMessage.mimetype.startsWith('video') ? 'video' : 'image'
                        )
                        const chunks = []
                        for await (const chunk of stream) chunks.push(chunk)
                        const buffer = Buffer.concat(chunks)

                        const tempDir = "./temp"
                        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

                        const inputPath = `${tempDir}/sticker_input_${Date.now()}.jpg`
                        const maskPath = `${tempDir}/mask_${Date.now()}.png`
                        const outputPath = `${tempDir}/sticker_${Date.now()}.webp`

                        fs.writeFileSync(inputPath, buffer)

                        execSync(
                            `ffmpeg -f lavfi -i color=c=black:s=512x512 -vf "format=rgba,geq='if(gt((X-256)^2+(Y-256)^2,256^2),0,255)':128:128:255" -frames:v 1 "${maskPath}" > /dev/null 2>&1`
                        )

                        const ffmpegCommand = mediaMessage.seconds
                            ? `ffmpeg -i "${inputPath}" -i "${maskPath}" -filter_complex "[0:v]scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000[img];[1:v]format=rgba[mask];[img][mask]alphamerge" -c:v libwebp -lossless 0 -compression_level 6 -q:v 50 -loop 0 -t 00:00:09 -an -vsync 0 "${outputPath}" > /dev/null 2>&1`
                            : `ffmpeg -i "${inputPath}" -i "${maskPath}" -filter_complex "[0:v]scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000[img];[1:v]format=rgba[mask];[img][mask]alphamerge" -vcodec libwebp -lossless 1 -compression_level 6 -q:v 80 -preset default -an -vsync 0 "${outputPath}" > /dev/null 2>&1`

                        execSync(ffmpegCommand)
                        await enviarsticker(makitawa, jid, m, outputPath)
                        await reagir(makitawa, jid, m, "✅")

                        fs.unlinkSync(inputPath)
                        fs.unlinkSync(maskPath)
                        fs.unlinkSync(outputPath)
                    } catch (error) {
                        erro(`Erro ao criar sticker: ${error.message}`)
                        await enviar(makitawa, jid, m, "❌ Erro ao criar sticker redondo. Verifique se o FFmpeg tá atualizado.")
                    }
                    break
                
                case "attp":
                    try {
                        const texto = body.slice(prefixo.length + 4).trim()
                        if (!texto) {
                            await enviar(makitawa, jid, m, `❌ Digita o texto pra gerar a figurinha.\nExemplo: ${prefixo}attp Makita Bot`)
                            return
                        }

                        await reagir(makitawa, jid, m, "⚙️")

                        const { execSync } = require("child_process")
                        const fs = require("fs")
                        const path = require("path")

                        const tempDir = "./temp"
                        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

                        const nomeArquivo = `attp_${Date.now()}`
                        const stickerPath = path.join(tempDir, `${nomeArquivo}.webp`)

                        const textoLimpo = texto.replace(/"/g, '\\"').substring(0, 100)
                        
                        const ffmpegCmd = `ffmpeg -f lavfi -i color=black:size=512x512:duration=3 -vf "format=rgba,drawtext=text='${textoLimpo}':fontsize=50:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libwebp -loop 0 -t 3 -y "${stickerPath}"`

                        execSync(ffmpegCmd)

                        await enviarsticker(makitawa, jid, m, stickerPath)
                        fs.unlinkSync(stickerPath)

                        await reagir(makitawa, jid, m, "✅")
                    } catch (error) {
                        erro(`Erro ao criar attp: ${error.message}`)
                        await enviar(makitawa, jid, m, "❌ Erro ao criar figurinha animada.")
                    }
                    break

                case "toimg":
                    try {
                        await reagir(makitawa, jid, m, "⏳")
                        
                        let stickerMessage = null
                        if (m.message.stickerMessage) {
                            stickerMessage = m.message.stickerMessage
                        } else if (m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
                            stickerMessage = m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage
                        }

                        if (!stickerMessage) {
                            await enviar(makitawa, jid, m, "❌ Envie ou marque um sticker para converter em imagem.")
                            return
                        }

                        const { downloadContentFromMessage } = require("@whiskeysockets/baileys")
                        const stream = await downloadContentFromMessage(stickerMessage, 'image')
                        
                        const chunks = []
                        for await (const chunk of stream) chunks.push(chunk)
                        const buffer = Buffer.concat(chunks)

                        const fs = require('fs')
                        const path = require('path')
                        const tempDir = "./temp"
                        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
                        
                        const tempImagePath = path.join(tempDir, `sticker_to_img_${Date.now()}.jpg`)
                        fs.writeFileSync(tempImagePath, buffer)

                        await enviarimagem(makitawa, jid, m, tempImagePath, "🖼️ Aqui está sua imagem convertida do sticker!")
                        fs.unlinkSync(tempImagePath)

                        await reagir(makitawa, jid, m, "✅")
                    } catch (error) {
                        erro(`Erro ao converter sticker para imagem: ${error.message}`)
                        await enviar(makitawa, jid, m, "❌ Erro ao converter sticker para imagem.")
                    }
                    break

                default:
                    if (body.startsWith(prefixo)) await reagir(makitawa, jid, m, "🤨")
                    break
            }
        } catch (error) {
            erro(`Erro no processamento de mensagem: ${error.message}`)
        }
    })

    makitawa.ev.on("group-participants.update", async (update) => {
        await handleGroupParticipantsUpdate(makitawa, update)
    })
}