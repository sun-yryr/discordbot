---
name: pnpm
type: knowledge
agent: CodeActAgent
keywords: [pnpm, filter, workspace, monorepo]
---

# pnpm の使用方法

このリポジトリでは、パッケージマネージャーとして pnpm を使用しています。pnpm はディスク効率の良いパッケージマネージャーで、モノレポ（複数のパッケージを含むリポジトリ）の管理に適しています。

## pnpm のインストール

[Corepack](https://github.com/nodejs/corepack) を使ってください。現状の Node.js のバージョンであればバンドルされているため、以下のコマンドで有効にできます。

```bash
corepack enable
```

asdf を利用している場合は上記コマンドの後に reshim が必要です。

```bash
asdf reshim nodejs
```

## 基本的なコマンド

### 依存関係のインストール

リポジトリのルートディレクトリで以下のコマンドを実行します：

```bash
pnpm install
```

## モノレポでのパッケージ指定 (`--filter` オプション)

このリポジトリでは、`--filter` オプションを使用して特定のパッケージに対してコマンドを実行します。

### 命名規則

* パッケージディレクトリ: `packages/<機能名>` (例: `packages/downloader`)
* package.json の name: `@sun-yryr/discordbot-<機能名>` (例: `@sun-yryr/discordbot-downloader`)
* フィルター指定: `discordbot-<機能名>` (例: `discordbot-downloader`)

### 使用例

特定のパッケージに対してコマンドを実行する場合：

```bash
pnpm --filter <フィルター名> <コマンド>
```

例えば、`downloader` パッケージをビルドする場合：

```bash
pnpm --filter discordbot-downloader run build
```

## よく使用するコマンド

* **ビルド**: `pnpm --filter <フィルター名> run build`
* **テスト**: `pnpm --filter <フィルター名> run test`
* **Lint チェック**: `pnpm --filter <フィルター名> run check`
* **Lint 自動修正**: `pnpm --filter <フィルター名> run fix`
* **依存の追加**: `pnpm --filter <フィルター名> add <パッケージ名>`
* **依存の追加(dev-dep)**: `pnpm --filter <フィルター名> add -D <パッケージ名>`
