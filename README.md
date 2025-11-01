# Makita Base

<p align="center">
  <img src="https://github.com/user-attachments/assets/b662c226-f336-4dd1-980d-cfe52fb158f1" alt="Makita Logo" width="180"/>
</p>

<p align="center">
  <a><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/></a>
  <a><img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp"/></a>
  <a><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/></a>
  <a><img src="https://img.shields.io/badge/Baileys-Enhanced-ff69b4?style=for-the-badge" alt="Baileys Enhanced"/></a>
</p>

---

## 🐬 Makita Base v1.2 – Nova Atualização

Bem-vindo à mais recente versão da **Makita Base**! Agora com melhorias significativas, novas funcionalidades e uma estrutura reorganizada para uma experiência mais fluida e personalizável.

---

## Sobre o Projeto

Olá! Eu sou Raphael ([Instagram: @rafasw7](https://instagram.com/rafasw7)), desenvolvedor especializado em JavaScript, Node.js, Python, HTML, CSS e mais.

A Makita Base é um bot de WhatsApp em Node.js projetado para facilitar a criação de chatbots poderosos, expansíveis e fáceis de customizar. Aqui você encontra uma base sólida para aprender, testar e desenvolver suas próprias funcionalidades.

---

## Recursos da Nova Atualização

- ⚙️ **Sistemas de segurança:** Antilink, antidocumento, antiaudio e outros.
- 🛠 **Correções:** Estabilidade aprimorada na conexão com o WhatsApp.
- 📂 **Organização:** Funções separadas em múltiplos arquivos (`funcoes/`), deixando o código mais limpo e modular.
- ✨ **Novos comandos:** Novos comandos adicionados, com novos cases e implementos para começar a expandir o bot.
- 📊 **Loggers:** Sistema de logs no terminal mostrando informações essenciais das mensagens (nome do usuário, lid, origem: grupo ou PV, tipo de mensagem, etc).
- 🗑 **Remoção de módulos antigos:** Substituição da versão anterior da Baileys modificada, evitando bugs e erros para os usuários.
- 🔄 **Updater:** Sistema que verifica automaticamente atualizações nos módulos instalados.

---

## ⚡ Configuração Rápida

Arquivo: `configurar/dados.json`
```json
{
  "prefixo": "."
}
```
**prefixo:** Define o caractere inicial dos comandos do bot (personalizável).

---

## 🚀 Instalação

**Pré-requisitos:**
- Node.js instalado
- Terminal (Termux, CMD, PowerShell, etc.)

**Passos:**
```bash
# 1) Entre na pasta do bot
cd makita-whatsapp

# 2) Instale as dependências
npm install

# Se estiver no Termux:
npm install --no-bin-links

# 3) Inicie o bot
sh iniciar.sh
```

---

## 🔗 Conexão com o WhatsApp

1. Execute `sh iniciar.sh`
2. Digite seu número completo (ex: `5511999999999`)
3. Copie o código que aparecer no terminal
4. No WhatsApp: Configurações → Dispositivos conectados → Conectar um dispositivo
5. Cole o código e conecte — o bot reiniciará e estará pronto para uso

---

## 🗂 Estrutura do Projeto

```
makita-base/
├── configurar/
│   └── dados.json
├── funcoes/
│   ├── mensagens.js
│   ├── loggers.js
│   ├── eventos.js
│   └── grupos.js
├── makita.js
├── conectar.js
└── package.json
```

---

## 📞 Contato & Suporte

- **Nome:** Raphael
- **Instagram:** [@rafasw7](https://instagram.com/rafasw7)
- **WhatsApp:** +55 62 8205-3713

💡 Adoro ver o que vocês criam com a base — marque-me quando publicar algo!

---

## ⚠️ Avisos Importantes

- Mantenha o Node.js sempre atualizado
- Não compartilhe os arquivos de sessão — são pessoais
- Use o bot respeitando os termos do WhatsApp
- Este projeto é destinado a aprendizado e desenvolvimento de bots

---

## 🙏 Agradecimentos

Criei esta base com muito carinho para a comunidade de desenvolvedores. Espero que aproveitem e construam coisas incríveis!

— Raphael ([Instagram: @rafasw7](https://instagram.com/rafasw7))

Se gostou, não esqueça de dar uma estrela no repositório! ⭐

<p align="center">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyNmdnbTZybGh1M2NiNXlyczF5ZTR2eDhlaG1lMHVqbG5zem1mODdlZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gDyCnwdmwgR36UAq8y/giphy.gif" alt="Makita em obra - animado" width="420" style="border-radius: 12px;">
</p>
