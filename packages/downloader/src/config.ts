const wrapEnv = (envName: string, message?: string) => {
    const env = process.env[envName];

    if (!env) {
        console.error(message ?? `${envName} is required.`);
        process.exit(1);
    }

    return env;
};

const config = {
    discordToken: wrapEnv("DISCORD_TOKEN"),
    clientId: wrapEnv("CLIENT_ID"),
    ytdlpPath: wrapEnv("YT_DLP_PATH"),
    downloadDir: wrapEnv("DOWNLOAD_DIR"),
};

export default config;
