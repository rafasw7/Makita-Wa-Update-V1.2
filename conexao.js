const fs = require("fs")
const crypto = require("crypto")
const readline = require("readline")
const pino = require("pino")
const NodeCache = require("node-cache")
const {
    bot,
    info,
    erro,
    cuidado,
    sucesso,
    erroFatal,
    checarAtualizacoes,
    mostrarInfoMaquina
} = require("./funcoes/loggers")

const sessionDir = ".sessoes"
const config = JSON.parse(fs.readFileSync("./configurar/dados.json", "utf8"))
const clear = "\x1B[2J\x1B[3J\x1B[H"

async function initializeCrypto() {
    if (!globalThis.crypto) {
        globalThis.crypto = {
            subtle: crypto.webcrypto.subtle,
            getRandomValues: (arr) => crypto.randomFillSync(arr),
        }
    }
}

async function requestPairingCode(makitawa) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const phoneNumber = await new Promise((resolve) => {
        info("Digite o número com DDI (ex: 5511999999999):")
        rl.question("", (answer) => {
            rl.close()
            resolve(answer)
        })
    })

    const cleanNumber = phoneNumber.trim().replace(/D/g, "")

    if (!cleanNumber || cleanNumber.length < 12) {
        erroFatal("Número inválido. Encerrando.")
        process.exit(0)
    }

    info("Solicitando código de pareamento...")
    const code = await makitawa.requestPairingCode(cleanNumber)
    sucesso(`Código de pareamento: ${code}`)
}

function setupConnection(makitawa, saveCreds, DisconnectReason) {
    makitawa.ev.on("creds.update", saveCreds)

    makitawa.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            sucesso("Conectado com sucesso!")
            makitawa.ev.on("messages.upsert", async (msg) => {
                await makitawa.readMessages(msg.messages.map(m => m.key))
            })
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                console.log(clear)
                cuidado(`Desconectado com status ${statusCode}. Reconectando...`)
                setTimeout(makita, 5000)
            } else {
                erroFatal("Logout detectado, encerrando processo.")
                process.exit(0)
            }
        }
    })
}

async function createSocket(baileys, state, version, msgRetryCounterCache) {
    const {
        Browsers,
        makeCacheableSignalKeyStore,
        makeWASocket,
        jidNormalizedUser,
    } = baileys

    return makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu("Chrome"),
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid)
            return (await store.loadMessage(jid, key.id))?.message || ""
        },
        msgRetryCounterCache,
    })
}

async function makita() {
    mostrarInfoMaquina()
    bot("Iniciando Makita...")

    try {
        await initializeCrypto()

        const baileys = await import("@whiskeysockets/baileys")
        const {
            useMultiFileAuthState,
            DisconnectReason,
            fetchLatestBaileysVersion,
        } = baileys

        const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
        const { version } = await fetchLatestBaileysVersion()
        const msgRetryCounterCache = new NodeCache()

        const makitawa = await createSocket(baileys, state, version, msgRetryCounterCache)

        if (!makitawa.authState.creds.registered) {
            await requestPairingCode(makitawa)
        }

        setupConnection(makitawa, saveCreds, DisconnectReason)

        require("./makita")(makitawa, config.prefixo, saveCreds, baileys)

        return makitawa
    } catch (error) {
        erroFatal(`Erro não tratado: ${error.message}`)
        setTimeout(makita, 5000)
    }
}

(async () => {
    await checarAtualizacoes()
    await makita()
})()