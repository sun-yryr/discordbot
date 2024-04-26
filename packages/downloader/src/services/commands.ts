import {
    type ApplicationCommandManager,
    ApplicationCommandOptionType,
} from "discord.js";

export async function addSlashCommands(
    commandManager: ApplicationCommandManager,
) {
    console.log("Started refreshing application (/) commands.");
    await commandManager.create({
        name: "dl",
        description: "Download video (using yt-dlp)",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "url",
                description: "download video url",
                required: true,
            },
        ],
    });
    console.log("Successfully reloaded application (/) commands.");
}
