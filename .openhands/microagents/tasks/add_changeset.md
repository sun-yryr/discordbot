---
name: add_changeset
type: task
agent: CodeActAgent
---

# Changeset の追加

このタスクは、コードの変更を記録するために Changeset を追加する方法を説明します。

## 前提条件

* リポジトリのクローンが完了していること
* 依存関係がインストールされていること (`pnpm install` を実行済み)
* コードに変更が加えられていること

## 手順

1. **変更内容の確認**

   まず、どのパッケージに変更を加えたかを確認します。複数のパッケージに変更を加えた場合は、それぞれのパッケージとその変更内容を把握しておきます。

2. **Changeset の追加**

   以下のコマンドを実行して、Changeset を追加します：

   ```bash
   pnpm changeset add
   ```

3. **変更したパッケージの選択**

   対話形式のプロンプトが表示されます。スペースキーを押して、変更したパッケージを選択します。選択が完了したら、Enter キーを押します。

   ```
   🦋  Which packages would you like to include? …
   ❯ ◯ @sun-yryr/discordbot-downloader
     ◯ @sun-yryr/discordbot-rss
     ◯ ...
   ```

4. **変更の種類の選択**

   次に、各パッケージの変更の種類を選択します。変更の種類は以下の 3 つです：

   * **patch**: 後方互換性のあるバグ修正（例: `1.0.0` → `1.0.1`）
   * **minor**: 後方互換性のある機能追加（例: `1.0.0` → `1.1.0`）
   * **major**: 後方互換性のない変更（例: `1.0.0` → `2.0.0`）

   ```
   🦋  Which packages should have a major bump? …
   ❯ ◯ @sun-yryr/discordbot-downloader
     ◯ @sun-yryr/discordbot-rss
     ◯ ...
   ```

   ```
   🦋  Which packages should have a minor bump? …
   ❯ ◯ @sun-yryr/discordbot-downloader
     ◯ @sun-yryr/discordbot-rss
     ◯ ...
   ```

   ```
   🦋  The following packages will be patch bumped:
   ❯ ◯ @sun-yryr/discordbot-downloader
     ◯ @sun-yryr/discordbot-rss
     ◯ ...
   ```

5. **変更内容の説明**

   最後に、変更内容の説明を入力します。この説明は、リリースノートに含まれます。

   ```
   🦋  Please enter a summary for this change (this will be in the changelogs).
   🦋  (submit empty line to open external editor)
   ```

   変更内容の説明は、以下のポイントを意識して書くことをお勧めします：

   * ユーザー視点で書く（「何が変わったか」ではなく「ユーザーにとって何が良くなったか」）
   * 具体的に書く（「バグ修正」ではなく「ファイルアップロード時のエラーハンドリングを修正」など）
   * 必要に応じて、変更の理由や背景を含める

6. **確認と完了**

   入力が完了すると、`.changeset/` ディレクトリに新しい Markdown ファイルが生成されます。このファイルには、変更の種類と説明が含まれています。

   ```
   🦋  Summary: ファイルダウンロード機能に進捗表示を追加しました。これにより、ユーザーは大きなファイルのダウンロード中に残り時間を確認できるようになります。
   🦋  Is this your desired changeset? (Y/n) · true
   🦋  Changeset added! - you can now commit it
   ```

   このファイルをコミットして、プルリクエストに含めます。

## 注意事項

* バージョンの更新（`changeset version`）と公開（`changeset publish`）は CI によって自動的に管理されるため、開発者が手動で実行する必要はありません。
* 複数の変更を含むプルリクエストでは、それぞれの変更に対して別々の Changeset を追加することをお勧めします。
* Changeset ファイルは、プルリクエストがマージされるまで編集できます。変更内容の説明を修正したい場合は、`.changeset/` ディレクトリ内の対応する Markdown ファイルを編集してください。
