import type { ChatInputCommandInteraction } from "discord.js";
import ytDlpWrap from "yt-dlp-wrap";
import config from "../config.js";

type Path = string;

const ytdlp = new ytDlpWrap.default(config.ytdlpPath);

export function download(
    url: string,
    interaction: ChatInputCommandInteraction,
): Promise<Path> {
    let percent = 0;
    const timer = setInterval(() => {
        interaction.editReply(`Downloading... ${percent}%`);
    }, 2500);

    return new Promise<Path>((resolve, reject) => {
        interaction.followUp("Downloading... 0%");
        ytdlp
            .exec([url, "--paths", config.downloadDir, "--no-playlist"])
            .on("progress", (progress) => {
                if (progress.percent) {
                    percent = progress.percent;
                }
            })
            .on("error", (err) => reject(err))
            .on("close", () => {
                interaction.editReply(`Downloaded! [link](${url})`);
                resolve("dummy");
            });
    }).finally(() => {
        clearInterval(timer);
    });
}
