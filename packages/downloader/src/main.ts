import { Client, GatewayIntentBits } from "discord.js";
import config from "./config.js";
import { addSlashCommands } from "./services/commands.js";
import { download } from "./services/download.js";

const globalClient = new Client({ intents: [GatewayIntentBits.Guilds] });

async function shutdown() {
    console.log("Shutting down...");
    globalClient.user?.setStatus("invisible");
    await globalClient.destroy();
}
process.addListener("SIGINT", shutdown);
process.addListener("SIGTERM", shutdown);

globalClient.on("ready", async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    await addSlashCommands(client.application.commands);
});

globalClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === "dl") {
        console.log("Started interaction handler");
        const url = interaction.options.getString("url", true);
        await interaction.deferReply();
        try {
            await download(url, interaction);
            console.log(`Ended interaction (url: ${url})`);
        } catch (e) {
            console.error(e);
            await interaction.editReply("An error occurred.");
        }
    }
});

await globalClient.login(config.discordToken);
