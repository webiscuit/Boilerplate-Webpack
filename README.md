### 使用中のプラグイン,テンプレート等 ###

* バージョン管理: gitlab
* パッケージマネージャー: npm
* タスクランナー: npm script
* モジュールバンドラー： Webpack
* CSS: PostCSS
  プラグインなどで必要な場合のみ Sass を併用
* HTMLテンプレートエンジン: Pug
* エディタ: Visual Studio Code

### ディレクトリ構成 ###

* src/ CSS,JS,HTMLの元ファイル
  webpack用のエントリーjsもこの中
* dist/ 開発用ファイルディレクトリー
* build/ 公開用ファイルディレクトリー
* webpack.config.babel.js　webpack系設定ファイル
* package.json

