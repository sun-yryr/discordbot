import eslintPluginYml from "eslint-plugin-yml";

export default [
    ...eslintPluginYml.configs["flat/recommended"],
    {
        files: [".github/**/*.yml", ".github/**/*.yaml"],
        rules: {
            "yml/block-sequence-hyphen-indicator-newline": [
                "error",
                "never",
                {
                    blockMapping: "always",
                },
            ],
        },
    },
    {
        ignores: ["pnpm-lock.yaml"]
    }
];
