# Discord おはよう Bot

毎朝8時（日本時間）にDiscordの指定チャンネルに「おはよう」メッセージを自動投稿するGitHub Actionsワークフローです。

## セットアップ手順

### 1. Discord Bot の作成

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」をクリックして新しいアプリケーションを作成
3. アプリケーション名を入力（例: おはようBot）
4. 左サイドバーの「Bot」をクリック
5. 「Add Bot」をクリック
6. Bot のトークンをコピー（後で使用）

### 2. Bot の権限設定

1. 「OAuth2」→「URL Generator」に移動
2. 「Scopes」で「bot」を選択
3. 「Bot Permissions」で「Send Messages」を選択
4. 生成されたURLでBotをサーバーに招待

### 3. チャンネルIDの取得

1. Discordで開発者モードを有効にする（設定 → 詳細設定 → 開発者モード）
2. メッセージを送信したいチャンネルを右クリック
3. 「IDをコピー」を選択

### 4. GitHub Secrets の設定

GitHubリポジトリの設定で以下のSecretsを追加してください：

- `DISCORD_BOT_TOKEN`: Discord Botのトークン
- `DISCORD_CHANNEL_ID`: メッセージを送信するチャンネルのID

#### Secretsの設定方法：
1. GitHubリポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Secrets and variables」→「Actions」をクリック
3. 「New repository secret」をクリック
4. 名前とトークンを入力して「Add secret」をクリック

### 5. ワークフローの動作確認

- ワークフローは毎日日本時間の8:00 AMに自動実行されます
- 手動でテストしたい場合は、GitHubの「Actions」タブから「Discord おはよう メッセージ」ワークフローを選択し、「Run workflow」をクリックしてください

## 注意事項

- Bot トークンは絶対に公開しないでください
- チャンネルIDは数字の文字列です（例: 123456789012345678）
- Botがチャンネルにメッセージを送信する権限があることを確認してください

## カスタマイズ

メッセージ内容を変更したい場合は、`.github/workflows/discord-ohayo.yaml` ファイルの `content` 部分を編集してください。
