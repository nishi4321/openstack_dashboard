# OpenStack Dashboard

![dashboard_image](./docs/img/dashboard.png)

OpenStack環境向けの簡易ダッシュボードです．  
少人数チームでのLAN内での使用を目的としているため，セキュリティ面も含め簡易的な物です．

# Features
- インスタンス一覧
- インスタンスの作成
    - rootユーザへのパスワード設定
    - パスフレーズでのSSH接続の許可設定
- インスタンスの削除

随時追加予定．

# Installation
```
$ npm i
```

# Configuration
`.env` ファイルを作成して以下の項目について記述してください．  
多くの項目はHorizon上から `OpenStack RCファイル` や `APIアクセス` から確認できます．
```
SUPER_SECRET=12345678 #JWT用のシークレット
OS_AUTH_URL=http://192.168.1.1:5000
OS_PROJECT_NAME="admin"
OS_USER_DOMAIN_NAME="Default"
OS_PROJECT_DOMAIN_NAME="Default" 
COMPUTE_API_URL=http://192.168.1.1:8774/v2.1
IMAGE_API_URL=http://192.168.1.1:9292
```