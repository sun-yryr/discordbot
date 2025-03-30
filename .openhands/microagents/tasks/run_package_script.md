---
name: run_package_script
type: task
agent: CodeActAgent
---

# パッケージスクリプトの実行

このタスクは、モノレポ内の特定のパッケージで npm スクリプトを実行する方法を説明します。

## 前提条件

* リポジトリのクローンが完了していること
* 依存関係がインストールされていること (`pnpm install` を実行済み)

## 手順

1. **パッケージ名の確認**

   実行したいパッケージのディレクトリ名を確認します。パッケージは `packages/` ディレクトリ内にあります。
   例えば、`packages/downloader` というディレクトリがある場合、パッケージ名は `downloader` です。

2. **フィルター名の決定**

   pnpm の `--filter` オプションで使用するフィルター名は、`discordbot-<パッケージ名>` という形式になります。
   例えば、`downloader` パッケージの場合、フィルター名は `discordbot-downloader` です。

3. **利用可能なスクリプトの確認**

   パッケージの `package.json` ファイルを確認して、利用可能なスクリプトを確認します。
   一般的なスクリプトには以下のようなものがあります：
   
   * `build`: TypeScript コードをコンパイルします
   * `test`: テストを実行します
   * `check`: コードの問題をチェックします
   * `fix`: コードの問題を自動修正します

4. **スクリプトの実行**

   以下のコマンドを実行して、特定のパッケージでスクリプトを実行します：

   ```bash
   pnpm --filter discordbot-<パッケージ名> run <スクリプト名>
   ```

   例えば、`downloader` パッケージをビルドする場合：

   ```bash
   pnpm --filter discordbot-downloader run build
   ```

## 一般的なスクリプトの例

### ビルド

```bash
pnpm --filter discordbot-<パッケージ名> run build
```

### テスト

```bash
pnpm --filter discordbot-<パッケージ名> run test
```

### Lint チェック

```bash
pnpm --filter discordbot-<パッケージ名> run check
```

### Lint 自動修正

```bash
pnpm --filter discordbot-<パッケージ名> run fix
```

## トラブルシューティング

* **「パッケージが見つからない」エラー**: フィルター名が正しいことを確認してください。`discordbot-` プレフィックスを忘れていないか確認してください。
* **「スクリプトが見つからない」エラー**: パッケージの `package.json` ファイルを確認して、指定したスクリプトが定義されていることを確認してください。
* **ビルドエラー**: 依存関係が正しくインストールされていることを確認してください。必要に応じて `pnpm install` を再実行してください。
