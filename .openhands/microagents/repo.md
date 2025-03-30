---
name: repo
type: repo
agent: CodeActAgent
---

このリポジトリは、プライベート Discord ボットの機能を提供する TypeScript モノレポです。
`packages/` ディレクトリ以下に、各機能ごとのパッケージが配置されています。

## セットアップ手順

### 前提条件

*   **Node.js**: ルートディレクトリの `package.json` で指定されたバージョンが必要です。
*   **pnpm**: Corepack を使用して管理されます。有効化されていない場合は、`corepack enable` を実行してください。

### インストール

リポジトリのルートディレクトリで以下のコマンドを実行し、依存関係をインストールします。

```bash
pnpm install
```

## リポジトリ構造と命名規則

*   **`infra/resources`**: 作成した Bot を自宅サーバーにデプロイするためのリソース定義です。
*   **`packages/`**: 各機能パッケージが含まれるディレクトリです。
    *   **フォルダ名**: `packages/<機能名>` (例: `packages/downloader`)。機能名を `A` とします。
    *   **`package.json` の `name`**: 各パッケージの `package.json` 内の `name` フィールドは `@sun-yryr/discordbot-A` という形式になります (例: `@sun-yryr/discordbot-downloader`)。
    *   **`pnpm --filter` での指定**: コマンド実行時にパッケージを指定する際は `discordbot-A` という形式を使用します (例: `discordbot-downloader`)。

## プルリクエスト

現在、プルリクエストのテンプレートは定義されていません。
