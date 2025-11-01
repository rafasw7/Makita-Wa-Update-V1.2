const chalk = require("chalk").default
const { exec } = require("child_process")
const os = require("os")
const oraImport = require("ora")

const ora = oraImport.default || oraImport
const spinner = ora()

const bot = (msg) => spinner.succeed(`${chalk.cyan("(BOT)")} ${chalk.white(msg)}`)
const info = (msg) => spinner.info(`${chalk.blueBright("(INFO)")} ${chalk.white(msg)}`)
const erro = (msg) => spinner.fail(`${chalk.red("(ERRO)")} ${chalk.white(msg)}`)
const cuidado = (msg) => spinner.warn(`${chalk.yellow("(CUIDADO)")} ${chalk.white(msg)}`)
const sucesso = (msg) => spinner.succeed(`${chalk.greenBright("(SUCESSO)")} ${chalk.white(msg)}`)
const erroFatal = (msg) => spinner.fail(`${chalk.magenta("(ERRO FATAL)")} ${chalk.white(msg)}`)
const updater = (msg) => spinner.start(`${chalk.gray("(UPDATER)")} ${chalk.white(msg)}`)

function mostrarInfoMaquina() {
    const cpus = os.cpus()
    const cpu = cpus[0] || { model: "Desconhecido" }
    const memoriaTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const memoriaLivre = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const memoriaUsada = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)
    
    console.log(chalk.cyan("╔══════════════════════════════════════╗"))
    console.log(chalk.cyan("║       INFORMAÇÕES DA MÁQUINA     ║"))
    console.log(chalk.cyan("╚══════════════════════════════════════╝"))
    console.log(`${chalk.white("• Processador:")} ${chalk.blue(cpu.model)}`)
    console.log(`${chalk.white("• Núcleos:")} ${chalk.blue(cpus.length)}`)
    console.log(`${chalk.white("• Arquitetura:")} ${chalk.blue(os.arch())}`)
    console.log(`${chalk.white("• Plataforma:")} ${chalk.blue(os.platform())}`)
    console.log(`${chalk.white("• Hostname:")} ${chalk.blue(os.hostname())}`)
    console.log(`${chalk.white("• Memória:")} ${chalk.blue(`${memoriaUsada}GB / ${memoriaTotal}GB (${memoriaLivre}GB livre)`)}`)
    console.log(`${chalk.white("• Node.js:")} ${chalk.blue(process.version)}`)
    console.log(`${chalk.white("• Uptime Sistema:")} ${chalk.blue(`${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`)}`)
    console.log(chalk.cyan("──────────────────────────────────────────────\n"))
}

function checarAtualizacoes() {
    return new Promise((resolve) => {
        updater("Verificando atualizações de módulos...")
        exec("npm outdated --json", (err, stdout) => {
            if (err && !stdout) {
                erro("Falha ao verificar atualizações.")
                resolve(false)
                return
            }
            if (!stdout.trim()) {
                info("Todos os módulos estão atualizados!")
                resolve(true)
                return
            }
            try {
                const pacotes = JSON.parse(stdout)
                const nomes = Object.keys(pacotes)
                if (nomes.length > 0) {
                    cuidado("Foram encontradas atualizações disponíveis:")
                    nomes.forEach((nome) => {
                        const { current, latest } = pacotes[nome]
                        console.log(`${chalk.gray("(UPDATER)")} ${chalk.white(`${nome}: ${current} → ${latest}`)}`)
                    })
                } else {
                    info("Nenhuma atualização encontrada.")
                }
            } catch {
                info("Atualizações detectadas, mas não foi possível parsear a lista.")
            }
            resolve(true)
        })
    })
}

const INDIVIDUO = chalk.magenta("• INDIVÍDUO:")
const NUMERO = chalk.cyan("• NÚMERO:")
const LID = chalk.yellow("• LID:")
const TIPO_CHAT = chalk.blueBright("• TIPO CHAT:")
const HORAS = chalk.greenBright("• HORAS:")
const MENSAGEM = chalk.white("• MENSAGEM:")
const MIDIA = chalk.red("• MIDIA:")
const COMANDO = chalk.gray("• COMANDO ?:")

const logMessage = ({ nome, numero, lid, tipoChat, hora, mensagem, midia, comando }) => {
    console.log(chalk.cyan("╔══════════════════════════════════════╗"))
    console.log(chalk.cyan("║          MENSAGENS NOVAS                  ║"))
    console.log(chalk.cyan("╚══════════════════════════════════════╝"))
    console.log(chalk.gray("──────────────────────────────────────────────"))
    console.log(`${INDIVIDUO} ${chalk.white(nome || "-")}`)
    console.log(`${NUMERO} ${chalk.white(numero || "-")}`)
    console.log(`${LID} ${chalk.white(lid || "-")}`)
    console.log(`${TIPO_CHAT} ${chalk.white(tipoChat || "-")}`)
    console.log(`${HORAS} ${chalk.white(hora || "-")}`)
    console.log(`${MENSAGEM} ${chalk.white(mensagem || "-")}`)
    console.log(`${MIDIA} ${chalk.white(midia || "-")}`)
    console.log(`${COMANDO} ${chalk.white(comando ? "SIM" : "NÃO")}`)
    console.log(chalk.gray("──────────────────────────────────────────────\n"))
}

module.exports = {
    bot,
    info,
    erro,
    cuidado,
    sucesso,
    erroFatal,
    updater,
    checarAtualizacoes,
    logMessage,
    mostrarInfoMaquina
}