# Coin Toss Android 2026

シンプルなコイントスPWAです。画面上のコインを長押しすると回転し、指を離すと徐々に減速して表か裏で止まります。

## 公開URL

GitHub Pagesで公開すると、URLは次の形式になります。

```text
https://moritalous.github.io/coin-toss-android-2026/
```

## ローカル起動

```powershell
npm install
npm start
```

ブラウザで `http://localhost:4173` を開きます。

## GitHub Pages公開

このリポジトリは `.github/workflows/pages.yml` でGitHub Pagesへ自動デプロイする設定です。

初回だけGitHubで次の設定を確認します。

1. Repository Settings を開く
2. Pages を開く
3. Build and deployment の Source を `GitHub Actions` にする
4. `main` ブランチへpushする

デプロイ状況はGitHubの Actions タブで確認できます。

## TWA / Bubblewrap

JDKは `mise` で管理します。BubblewrapはAndroid command line toolsとの互換性上、JDK 17を要求するため、このリポジトリではTemurin 17を指定しています。

```powershell
mise install
npm install
npm run twa:setup:jdk
npm run twa:doctor
```

Androidプロジェクト生成:

```powershell
npm run twa:init
```

生成後の主なコマンド:

```powershell
npm run twa:build
npm run twa:update
npm run twa:fingerprint:key
npm run twa:fingerprint:add -- "<SHA-256 fingerprint>"
npm run twa:fingerprint:list
npm run twa:assetlinks
```

`twa:assetlinks` は `.well-known/assetlinks.json` を生成します。生成後にGitHub Pagesへ反映すると、TWAのDigital Asset Links確認に使われます。

GitHub Pagesのプロジェクトサイトを使う場合でも、Digital Asset Linksはホスト直下に必要です。このアプリのホストは `moritalous.github.io` なので、実際に検証されるURLは次です。

```text
https://moritalous.github.io/.well-known/assetlinks.json
```

`https://moritalous.github.io/coin-toss-android-2026/.well-known/assetlinks.json` ではTWA検証に使われません。生成した内容は `moritalous/moritalous.github.io` リポジトリ側にも配置します。

初回ビルド時にAndroid SDKライセンス確認が表示されたら、内容を確認して `y` で承諾します。

## Google Play公開の想定

このリポジトリはPWA本体です。Google Playへ出す場合は、公開済みHTTPS URLを用意したうえで Trusted Web Activity として Android アプリ化します。

一般的な流れ:

1. PWAをHTTPSで公開する
2. Chrome DevTools Lighthouse でPWA要件を確認する
3. BubblewrapなどでTWAプロジェクトを生成する
4. Android App Bundleを署名してGoogle Play Consoleへ登録する
