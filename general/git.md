# Git 運用ガイドライン

## 目次
- [基本原則](#基本原則)
- [ブランチ戦略](#ブランチ戦略)
- [コミット規約](#コミット規約)
- [プルリクエスト](#プルリクエスト)
- [コードレビュー](#コードレビュー)
- [リリースフロー](#リリースフロー)
- [トラブルシューティング](#トラブルシューティング)
- [Git コマンド集](#git-コマンド集)
- [.gitignore の設定](#gitignore-の設定)

## 基本原則

### 1. 一貫性の維持
- チーム全体で同じGitワークフローを使用する
- 命名規則とコミットメッセージの形式を統一する
- 自動化ツールを活用してルールの遵守を促進する

### 2. 小さな変更単位
- 大きな変更は小さな単位に分割する
- 1つのコミットは1つの論理的な変更に対応させる
- レビューしやすく、問題が発生した場合に切り分けやすくする

### 3. 履歴の明確さ
- コミット履歴は「なぜ」その変更を行ったかを説明するドキュメントとして扱う
- マージコミットを適切に活用し、開発の流れを明確にする
- 履歴の改変（rebase, force push）は共有ブランチでは原則禁止

## ブランチ戦略

### メインブランチ
- `main`: 本番環境にデプロイされるコード（常に安定した状態を維持）
- `develop`: 開発の統合ブランチ（次回リリース用の機能が集約される）

### 機能ブランチ
- `feature/<機能名>`: 新機能の開発用
- `bugfix/<バグID>`: バグ修正用
- `hotfix/<緊急バグID>`: 本番環境の緊急バグ修正用
- `release/<バージョン>`: リリース準備用

### ブランチ命名規則
- すべて小文字で、単語間はハイフン（-）で区切る
- 機能名やバグIDは簡潔かつ説明的にする
- 例: `feature/user-authentication`, `bugfix/login-error-123`

### ブランチワークフロー（Git Flow）

1. **機能開発**:
   - `develop`から`feature/xxx`ブランチを作成
   - 開発完了後、`develop`へプルリクエスト
   - レビュー後、`develop`へマージ

2. **リリース準備**:
   - リリース時に`develop`から`release/vX.Y.Z`ブランチを作成
   - リリース準備（バージョン番号更新、最終テスト）
   - 準備完了後、`main`と`develop`の両方へマージ

3. **緊急バグ修正**:
   - `main`から`hotfix/xxx`ブランチを作成
   - 修正後、`main`と`develop`の両方へマージ
## コミット規約

**重要**: すべてのコミットメッセージは英語で記述してください。これはグローバルな開発環境での一貫性と理解しやすさを確保するためです。

### コミットメッセージの形式
```
<種類>(<スコープ>): <タイトル>

<本文>

<フッター>
```
```

### 種類（Type）
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正や機能追加ではないコード変更
- `perf`: パフォーマンスを向上させるコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更、ライブラリの更新など

### スコープ（Scope）
- 変更が影響する範囲（コンポーネント名、ファイル名など）
- 例: `auth`, `api`, `ui`, `config`

### タイトル
- **英語で記述する**
- 命令形、現在形で記述（"change" ではなく "change"）
- 最初の文字は小文字
- 末尾にピリオドを付けない
- 50文字以内に収める

### 本文（オプション）
- **英語で記述する**
- タイトルと本文の間に空行を入れる
- 「なぜ」その変更が必要だったかを説明
- 72文字で改行

### フッター（オプション）
- 関連するIssue番号や破壊的変更の情報
- 例: `Closes #123`, `BREAKING CHANGE: APIの仕様変更`

### コミットメッセージの例
```
feat(auth): add OAuth2 support for user authentication

Implement OAuth2 authentication flow to support Google account login.
This improves user experience and reduces registration barriers.

Closes #456
```

## プルリクエスト

### PRの作成ガイドライン
1. **タイトル**: コミットメッセージと同様の形式で、変更内容を簡潔に説明
2. **説明**:
   - 変更の目的と背景
   - 実装の概要
   - テスト方法
   - スクリーンショットや動画（UI変更がある場合）
3. **レビュアー**: 適切なチームメンバーをアサイン
4. **関連Issue**: 関連するIssue番号をリンク

### PRテンプレート
```markdown
## Changes
<!-- Description of the changes -->

## Reason for Changes
<!-- Why these changes are necessary -->

## Implementation Details
<!-- How the changes were implemented, important points -->

## Testing Instructions
<!-- Steps to test these changes -->

## Screenshots
<!-- If UI changes are included -->

## Related Issues
<!-- Links to related issues -->
```

### PRサイズ
- 理想的なPRは200〜400行の変更
- 500行を超える場合は、可能であれば複数のPRに分割
- レビューの負担を減らし、品質を向上させるため

## コードレビュー

### レビューの基本原則
1. **コードではなく、人をレビューしない**: 建設的なフィードバックを心がける
2. **具体的な提案**: 問題点だけでなく、改善案も提示
3. **優先順位**: 重要な問題（バグ、セキュリティ、パフォーマンス）を優先
4. **文脈を理解**: PRの目的と背景を踏まえてレビュー

### レビューのチェックポイント
- 機能要件を満たしているか
- コーディング規約に準拠しているか
- テストは十分か
- エラー処理は適切か
- パフォーマンスへの影響は考慮されているか
- セキュリティリスクはないか

### レビューコメントの書き方
- 明確で具体的な指摘
- 理由の説明
- 可能であれば改善案の提示
- 優先度の明示（必須 vs 提案）

## リリースフロー

### バージョニング（セマンティックバージョニング）
- **メジャー（X.y.z）**: 後方互換性のない変更
- **マイナー（x.Y.z）**: 後方互換性のある機能追加
- **パッチ（x.y.Z）**: 後方互換性のあるバグ修正

### リリース手順
1. `develop`から`release/vX.Y.Z`ブランチを作成
2. バージョン番号の更新
3. リリースノートの作成
4. 最終テストと品質確認
5. `main`へのマージとタグ付け
6. `develop`へのマージ（リリース中に行われた修正を取り込む）

### リリースノート
- 追加された機能
- 修正されたバグ
- 非推奨になった機能
- 破壊的変更と移行ガイド
- 謝辞（コントリビューターへの感謝）

## トラブルシューティング

### 一般的な問題と解決策

#### コンフリクトの解決
1. 最新の親ブランチを取り込む: `git pull origin develop`
2. コンフリクトを解決
3. 変更をコミット: `git add . && git commit -m "resolve conflicts"`

#### 誤ったコミットの修正
- 直前のコミットを修正: `git commit --amend`
- 複数のコミットを修正: `git rebase -i HEAD~3`（最新3つのコミットを対象）

#### 変更の取り消し
- ステージングの取り消し: `git reset HEAD <file>`
- コミットの取り消し（履歴を残す）: `git revert <commit>`
- コミットの取り消し（履歴を書き換え）: `git reset --hard <commit>`

#### ブランチの整理
- 古いブランチの削除: `git branch -d <branch>`
- リモートブランチの削除: `git push origin --delete <branch>`

### 緊急時の対応

#### 本番環境のバグ対応
1. `main`から`hotfix/xxx`ブランチを作成
2. バグを修正
3. `main`へマージしてリリース
4. `develop`へもマージして次回リリースにも反映

#### 誤ってpushした機密情報の削除
1. 機密情報を削除したコミットを作成
2. `git filter-branch`または`BFG Repo-Cleaner`を使用して履歴から完全に削除
3. `git push --force`でリモートリポジトリを更新
4. すべての開発者に新しいクローンを作成するよう依頼

## Git コマンド集

### 基本操作
```zsh
# リポジトリの初期化
git init

# リポジトリのクローン
git clone <URL>

# 変更の確認
git status

# 変更のステージング
git add <file>
git add .  # すべての変更をステージング

# 変更のコミット
git commit -m "commit message in English"

# リモートへのプッシュ
git push origin <branch>

# リモートからのプル
git pull origin <branch>
```

### ブランチ操作
```zsh
# ブランチの一覧表示
git branch
git branch -a  # リモートブランチも含む

# ブランチの作成
git branch <branch>

# ブランチの切り替え
git checkout <branch>
git switch <branch>  # Git 2.23以降

# ブランチの作成と切り替えを同時に行う
git checkout -b <branch>
git switch -c <branch>  # Git 2.23以降

# ブランチの削除
git branch -d <branch>
git branch -D <branch>  # 強制削除
```

### 変更の統合
```zsh
# マージ
git merge <branch>

# リベース
git rebase <branch>

# マージ中のコンフリクト解決後
git add <resolved-files>
git merge --continue

# リベース中のコンフリクト解決後
git add <resolved-files>
git rebase --continue
```

### 履歴の確認
```zsh
# コミット履歴の表示
git log
git log --oneline  # 簡潔な表示
git log --graph  # グラフ表示

# 特定ファイルの履歴
git log -- <file>

# 変更内容の確認
git diff
git diff --staged  # ステージング済みの変更
```

### 高度な操作
```zsh
# 直前のコミットの修正
git commit --amend

# 複数コミットの統合・編集
git rebase -i HEAD~<n>

# スタッシュ（一時保存）
git stash
git stash pop  # 復元と削除
git stash apply  # 復元のみ

# タグ付け
git tag <tag-name>
git tag -a <tag-name> -m "メッセージ"  # 注釈付きタグ

# リモートリポジトリの管理
git remote add <name> <URL>
git remote -v  # リモートの一覧表示
```

### Git設定
```zsh
# ユーザー情報の設定
git config --global user.name "名前"
git config --global user.email "メールアドレス"

# エディタの設定
git config --global core.editor "vim"

# エイリアスの設定
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

## .gitignore の設定

以下のファイルやディレクトリはリポジトリにコミットしないでください：

- `node_modules/`: NPM依存関係のディレクトリ
- `target/`: ビルド成果物のディレクトリ
- ビルド成果物: `dist/`, `build/`, `out/` など
- ログファイル: `*.log`
- 環境設定ファイル: `.env`, `.env.local` など（機密情報を含む可能性があるため）
- エディタ固有の設定: `.idea/`, `.vscode/` など（個人設定のため）
- OS固有のファイル: `.DS_Store`, `Thumbs.db` など

標準的な.gitignoreの例:

```
# 依存関係
node_modules/
package-lock.json

# ビルド成果物
target/
dist/
build/
out/

# ログ
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 環境変数
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# エディタ
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# OS
.DS_Store
Thumbs.db
