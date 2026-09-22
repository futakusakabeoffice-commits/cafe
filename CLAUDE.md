# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code（および他の AI エージェント）向けのガイドです。

## プロジェクト概要

**KOMOREBI COFFEE（木漏れ日珈琲）** の公式サイト（ポートフォリオ用の架空カフェ）。
自家焙煎コーヒー＋手づくりスイーツ＋テラス席が売りの個人経営カフェ、という設定。

- ビルド不要の**静的サイト**（HTML / CSS / 素の JS のみ）。フレームワーク・パッケージマネージャ・ビルドツールは一切使用していない（`package.json` なし）。
- デザインは Claude（Claude デザイン機能）経由で生成されたもの。デザインルールと構成案は `docs/DESIGN.md` と `docs/CONTENTS.md` に定義されており、**この2つが本サイトのソース・オブ・トゥルース**。実装で仕様と迷ったら、まずこの2ファイルを参照すること。
  - `docs/DESIGN.md`: カラー・タイポグラフィ・スペーシング・コンポーネント仕様・レスポンシブ仕様（デザインシステム）
  - `docs/CONTENTS.md`: トップページの構成・掲載テキスト・ダミーデータの一覧（コンテンツ仕様）

店名・人名・住所・電話番号・価格・お知らせ本文などは **すべて架空（ダミー）**。「〇〇」の箇所や `03-0000-0000` のような電話番号は公開前に差し替える前提で、実装上もそのまま残してよい。

## ディレクトリ構成

```
index.html            トップページ（#top, #story, #menu, #roaster, #news, #access, フッターAを1ページに集約）
concept.html           こだわり（下層ページ／ヒーローC＋理念テキスト＋焙煎士紹介）
menu.html              メニュー一覧（js/menu.js でカテゴリーフィルター付きに動的レンダリング）
menu-detail.html       商品情報・商品紹介（左右交互レイアウトの商品紹介セクション）
news.html              お知らせ一覧（2カラムレイアウト）
news/YYYY-MM-DD.html   お知らせ個別記事（5件。news.html からの相対リンク、../ で親階層のcss/js/images/他ページを参照）
access.html            店舗情報・ご予約・アクセス
privacy-policy.html    プライバシーポリシー（フッターの「プライバシーポリシー」「プライバシー設定」リンク先）
404.html               カスタム404ページ（noindex、トップへの導線あり）
robots.txt             クローラー制御（Sitemap行はプレースホルダードメイン）
sitemap.xml            全12ページのURLを列挙（プレースホルダードメイン）
site.webmanifest       PWA向けマニフェスト（アイコン・テーマカラー定義）
css/style.css          サイト全体の共通CSS（トークン・リセット・レスポンシブ用コンポーネントクラス。詳細は下記「レスポンシブ実装」参照）
js/menu.js             menu.html 用：カテゴリーフィルター（ALL/COFFEE/SWEETS/TAKE OUT）とアイテム一覧の描画
js/nav.js              全ページ共通：ドロワーメニューの開閉制御（フォーカストラップ・Esc・オーバーレイクリックで閉じる・aria-expanded切り替え・inert切り替え）
images/                写真素材（hero, menu-*, gallery-01〜06, roaster, terrace）＋同名の .webp（軽量版）＋ og-image.jpg（1200×630のOGP画像、hero.jpgから合成）
images/icons/           favicon.svg / favicon-16.png / favicon-32.png / apple-touch-icon.png / icon-192.png / icon-512.png（自作のコーヒーカップの線画アイコン）
docs/DESIGN.md          デザインシステム仕様書（原本）
docs/CONTENTS.md        トップページ構成・コンテンツ仕様書（原本）
```

`index.html` のグローバルナビ（デスクトップ縦並びナビ・ドロワー・フッターA）は `docs/CONTENTS.md` の6項目（Home / こだわり / メニュー / 焙煎士 / お知らせ / 店舗情報）と一致している。ROASTER セクションには `id="roaster"` を実装済み。`docs/CONTENTS.md` 第8章の「掲載メディア（#media）」セクションは、参考画像が実在しない（プレースホルダーのみになる）ためユーザーの判断で実装しないことになった。今後このセクションを追加する場合は、実際の掲載メディアの写真・ロゴを用意したうえで判断すること。

## 実装スタイル（重要）

- **スタイリングは基本的にインラインの `style` 属性**で書かれている（色・字間・行間など、ブレイクポイントをまたいで変化しない装飾的な値）。**ただし、ブレイクポイントで値が変わる箇所（グリッド列数、flex-direction、固定要素の表示切り替え、paddingの大きなジャンプなど）は `css/style.css` 側のクラスに切り出し、そこにメディアクエリを書く**、というのが現在のルール。インラインstyleに`@media`は書けないため、レスポンシブ化が必要な性質のプロパティは必ずクラス経由にすること。新しい要素を追加する際もこの使い分けに従う。
- **CSS変数（トークン）を `:root` に定義済み**（`css/style.css` 冒頭、`docs/DESIGN.md` 第2章に対応）。ただし置き換えはまだ全面的ではなく、既存のインラインstyleの大半は引き続き16進カラーコードを直接書いている（新規追加分のみ `var(--color-*)` を使用）。色を一括変更する場合は `:root` の変数値とインラインのハードコード箇所の両方を確認すること。
- **連続的にスケールする値（見出しサイズ・写真の高さ・アーチの角丸半径・回転バッジ直径など）は `clamp()` を使ってインラインstyleのまま実装している。** ブレイクポイントごとの離散的な値ではなく、画面幅に応じて滑らかに変化する。これにより多くの箇所はクラス化やメディアクエリなしでレスポンシブになっている。
- 各ページ末尾のフッターとページ上部の縦書きロゴ／パンくずリストは、下層ページ間でほぼ同じマークアップがページごとに複製されている（共通コンポーネント化・テンプレート化はされていない）。フッター内容を変更する場合は `concept.html` / `menu.html` / `menu-detail.html` / `news.html` / `access.html` / `privacy-policy.html` / `news/*.html`（5ファイル）の該当箇所を個別に修正する必要がある。`news/` 配下は1階層下にあるため、css・js・images・他ページへのリンクはすべて `../` を付けた相対パスになっている点に注意。
- フォントは Google Fonts を `css/style.css` の `@import` 経由で読み込み（Shippori Mincho, Zen Kaku Gothic New, Cormorant Garamond, Jost）。`docs/DESIGN.md` 第3章のフォント使い分けルール（見出し=明朝体、本文/ナビ=ゴシック体、装飾的英数字=Cormorant Garamond、ラベル/UI英数字=Jost）に従っている。
- アクセシビリティ対応（`aria-label`, `aria-current="page"`, `aria-hidden`, `alt` テキスト, `:focus-visible` アウトライン）は各ページで一定程度実装済み。新規要素を追加する際も同水準を維持すること。
- ナビゲーションリンクの並び（デスクトップ縦並びナビ・フッターA/B・ドロワー）はすべて `<nav aria-label="...">` の中に `<ul style="...flexスタイル...;list-style:none;margin:0;padding:0"><li><a>...</a></li></ul>` という形でリスト化されている。新しいリンク群を追加する場合もこの形に合わせること（レイアウト用の `display:flex` 等は `<ul>` 側に、`<nav>` は素の landmark として `aria-label` のみを持つ）。パンくずリストも同様に `<nav aria-label="パンくずリスト">` の中を `<ol><li>` 化しており、区切りの「〉」は `<li aria-hidden="true">` でラップしている。
- 各ページの `<div id="top">` 直下は `<main>...</main>` → `<footer>...</footer>` の2ランドマーク構成（`<main>` は1ページ1つ、`vlogo-fixed`・モバイルナビボタン類も含めて `<footer>` の直前までを囲む）。
- ドロワー（`<aside id="site-drawer" class="drawer" data-drawer aria-hidden="true" inert>`）は閉じている間 `inert` 属性も持たせ、中のリンク・ボタンがキーボードフォーカス／スクリーンリーダーから完全に除外されるようにしている。`js/nav.js` が開閉時に `aria-hidden` と `inert` を同期して付け外しする。新しくドロワーを使うページを追加する場合、初期状態のマークアップに `aria-hidden="true" inert` の両方を必ず入れること（`inert` を忘れると、閉じたドロワー内のリンクがTabキーでフォーカスできてしまうアクセシビリティ不具合になる）。

## レスポンシブ実装

全ページ、モバイル（〜1023px、基準幅390px）・デスクトップ（1024px〜）に対応済み。`css/style.css` に定義したコンポーネントクラスと `@media (min-width: 1024px)` / `@media (max-width: 1023px)` の組み合わせで実装している。

### モバイルナビゲーションの方針

`docs/DESIGN.md` 第6章は M1（Menuリンク型）/ M2（タブバー型）/ M3（円形MENU型）の3パターンを定義し、「ブランドページは M1 か M3 のどちらか一方に統一」と指定しつつ、ヒーローA（回転バッジ）のページでは円形MENUボタンを使わないという例外も明記している。このサイトでは以下のように使い分けている。

- **`index.html`（ヒーローA・回転バッジあり）→ M1**：画面右上に固定の「Menu」テキストリンク（`.menu-link`）。回転バッジと同じ角に円形ボタンを重ねないための、DESIGN.md記載の例外パターン。
- **その他5ページ（ヒーローC or ヒーローなし）→ M3**：左上に縦書きロゴ、右上に固定ピル（`.mobile-pill`。オンラインショップがないため「ご予約」「本日の営業時間」など文脈に応じた文言に差し替え）、右下に白い円形MENUボタン（`.mobile-menu-btn`、64px）。
  - **例外**: `concept.html` / `access.html` はヒーローC自体に右上パンくずリストがあり、`.mobile-pill` を重ねると衝突するため、これら2ページでは `.mobile-pill` を置かず、円形MENUボタンのみを表示している（DESIGN.md のヒーローC・スマホ仕様に準拠）。`privacy-policy.html` と `news/*.html`（お知らせ個別記事）も同様に、自然な短いCTA文言が無いため `.mobile-pill` を置かず円形MENUボタンのみとしている。新しくこのパターンのページを追加する場合、ふさわしい文言があれば `.mobile-pill` を足してよい。

どちらのパターンも同じドロワーメニュー（`.drawer` / `.drawer-overlay`、各ページ末尾に配置）を開く。開閉制御は `js/nav.js`（フォーカストラップ・Escで閉じる・オーバーレイクリックで閉じる・`body.drawer-locked` でスクロールロック）。新しいページを追加する場合は、既存ページのドロワー用マークアップ（`data-drawer` / `data-drawer-open` / `data-drawer-close` / `data-drawer-overlay`）と `<script src="js/nav.js">` をそのままコピーすること。

### 主なレスポンシブ用クラス（`css/style.css`）

| クラス | 用途 |
| --- | --- |
| `.drawer` / `.drawer-overlay` | ドロワーメニュー本体とオーバーレイ（1024px以上では非表示） |
| `.menu-link` | M1「Menu」テキストリンク（1024px未満のみ表示） |
| `.mobile-pill` / `.mobile-menu-btn` | M3の固定ピル／円形MENUボタン（1024px未満のみ表示） |
| `.vlogo-fixed` | 縦書きロゴ。デスクトップは`position:fixed`、モバイルは通常フローに戻り説明文（`.vlogo-sub`）を非表示 |
| `.subpage-shell` / `.subpage-content` / `.subpage-footer` | 下層ページ（menu / menu-detail / news）の左パディング96px（vlogo用）をデスクトップのみ適用する共通シェル |
| `.hero-a-grid` / `.hero-a-logo` / `.hero-a-photo-wrap` / `.hero-a-nav` / `.rotate-badge` | トップページのヒーローA。3カラムグリッドはデスクトップのみ、モバイルは1カラム積み |
| `.hero-c` / `.hero-c-title` | 下層ページ導入部のヒーローC。高さがモバイル100svh／デスクトップ70vh |
| `.split-2col` / `.split-2col-img-first` | 写真＋テキストの2カラム（ロースター紹介・商品紹介）。モバイルは1カラム積みで写真を先頭に |
| `.grid-3col` / `.gallery-grid` / `.news-cols` / `.info-grid` | メニュータイル・Instagramギャラリー・お知らせ・店舗情報の列数をブレイクポイントごとに変更 |
| `.overlap-card` | 写真に食い込む情報カードのオーバーラップ量（モバイル-48px／デスクトップ-96px） |
| `.filters-row` | メニュー一覧のカテゴリーフィルター。モバイルは横スクロール＋スナップ |
| `.footer-a-row` / `.footer-a-social` / `.footer-b-row` / `.footer-b-links` / `.footer-b-brand` | フッターA・フッターBの、モバイル縦積み→デスクトップ横並びの切り替え |
| `.product-feature` / `.feature-pad-l` / `.feature-pad-r` / `.feature-min-h` | `menu-detail.html` の商品紹介セクション。モバイルは写真フルブリード＋パディング0、デスクトップは左右非対称パディング＋min-height 560px |
| `.notice-tab` | デスクトップのみのお知らせタブ（`news.html`）。モバイルは `.mobile-pill` に置き換え |

### 意図的な簡略化（既知の差分）

- `docs/DESIGN.md` はメニュー一覧ページのモバイル表示を「商品リスト行」（サムネイル55%＋商品名の横並び、カテゴリーごとに見出し罫線で区切る）という専用レイアウトで指定しているが、実装では `js/menu.js` のカード（写真上・テキスト下）をそのままモバイルでも1カラムで積む簡略構成にしている。カテゴリー別の行リスト表示への変更は `js/menu.js` の `renderItems()` の書き換えが必要。
- モバイルの多くのサイズ（見出しフォントサイズ、写真の高さ、アーチの角丸、回転バッジの直径など）は `docs/DESIGN.md` が指定する離散値ではなく `clamp()` による連続的なフルード値で実装している。基準幅390pxとデスクトップ1024px+の両端では概ねDESIGN.mdの数値に一致するが、中間のタブレット幅では厳密な数値一致より滑らかな変化を優先している。
- カテゴリーフィルターのモバイル表示は「折り返しなし・横スクロール＋スナップ」（`.filters-row`）とし、DESIGN.mdの記載通りに実装している。

## カラーパレット早見表（詳細は docs/DESIGN.md 第2章）

| 役割 | コード | 用途 |
| --- | --- | --- |
| Primary（深煎りブラウン） | `#4A2C21` | ロゴ・見出し・メインボタン背景 |
| Secondary（木漏れ日ゴールド） | `#A8964A` | 罫線・アイコンのみ（明るい背景で文字色に使わない） |
| Accent（苺レッド） | `#D22A2E` | チップ・スウォッシュ・回転バッジ・CTAの点（1画面1〜2箇所まで） |
| Cream | `#F0E6CC` | ソフトボタン・タブバー背景 |
| Background | `#FCFAF6` | ベース背景（ミルクホワイト） |
| Background Sub | `#F4EEE5` | カード・フッター背景 |
| Background Alt | `#EADFD0` | 下層ページの中間トーン背景 |
| Text Main | `#3A241B` | 本文テキスト |
| Text Muted | `#6B5B51` | 価格・日付・ラベルなど補足テキスト |
| Text On Dark | `#F5EFE6` | 暗い写真・背景の上の文字 |
| Border | `#CDBFAE` | 罫線・区切り線 |

## リリース前チェックリスト対応状況

ユーザー提供の「リリース前チェックリスト」（46項目）を全12ページに対して確認・対応済み（対応日: 2026年9月）。以降このチェックリストで再確認する場合は、下記の状況を踏まえること。

### 対応済み

- **メタ/SEO**: 全ページに `<meta name="description">`（140〜300字＋CTA）、`<meta name="robots" content="index, follow">`（404.htmlのみ `noindex, follow`）、`<link rel="canonical">`、JSON-LD構造化データ（`CafeOrCoffeeShop`＝Organizationのサブタイプ＋下層ページは`BreadcrumbList`）を追加。`<html lang="ja">` は元々対応済み。
- **OGP/SNS**: `og:title` / `og:description` / `og:type`（トップ・下層は`website`、お知らせ個別記事は`article`）/ `og:site_name` / `og:locale` / `og:image`（1200×630、`images/og-image.jpg`。既存の `hero.jpg` にロゴ・キャッチコピーを合成して自作） / `twitter:card`（`summary_large_image`）を追加。
- **favicon**: `images/icons/` にコーヒーカップの線画アイコンを自作（SVG＋16/32/180/192/512pxのPNG）。`site.webmanifest` も新規作成し、`theme-color` メタタグも追加。
- **パフォーマンス**: 全 `<img>` を `<picture>` 化し、同名の `.webp`（品質80、元画像比おおよそ40〜45%減）を優先読み込み、`.jpg` をフォールバックに設定。`width`/`height` 属性を実寸で明示（CLS対策）。ファーストビュー画像（`hero.jpg`・`terrace.jpg`・`gallery-02.jpg`・`menu-blend.jpg`の各ページの最初の1枚）のみ `loading="eager" fetchpriority="high"`、それ以外は `loading="lazy"`。`js/menu.js` が動的生成するカード画像も同様に対応。
- **表示/互換性**: `viewport` は元々対応済み。375px/1440pxでPlaywrightスクリーンショットを再確認し崩れなし。
- **アクセシビリティ**: 画像 `alt` は元々全て説明文あり。見出し階層を修正（`index.html` に `<h1>` が1つも無かった不具合、`menu.html` の動的カード見出しが `h1→h3` に飛んでいた不具合を修正）。ナビゲーション・パンくずのリスト化、`<main>` ランドマーク追加、ドロワーの `inert` 対応（後述）を実施。
- **コーディング**: セマンティックHTML（`nav > ul > li`、`main`、パンくずの `ol > li`）を導入。CSS/JSの完全外部化（インラインstyle撲滅）は下記「未対応」を参照。
- **コンテンツ/QA**: 全12ページ＋新規追加分を含む48リソースのリンク切れを再チェックし全て200 OK。コピーライトに年号を追加（`© 2026 KOMOREBI COFFEE`）。専用404ページ（`404.html`）を新規作成。
- **法務/インフラ**: プライバシーポリシーは既に公開・フッターリンク済み。環境変数はAPIキー等を使わない静的サイトのため該当なし。
- **Lighthouse実測**（ローカルサーバーに対して実行、モバイル・simulate throttling）: 全ページで performance 92〜99 / accessibility 100 / best-practices 96 / SEO 100（404.htmlのみ意図的な`noindex`によりSEOスコアが下がるが、これは正しい設定）。best-practicesの−4点は本セッションのサンドボックス環境がGoogle Fontsへの外部通信をプロキシでブロックしているために出るコンソールエラーで、実際のホスティング環境では発生しない見込み。

### 追加素材・実インフラが無いと完了できない項目（未対応）

- **canonical / og:url / og:image / robots.txt の Sitemap行 / sitemap.xml の URL**: 実際の公開ドメインが未確定のため、プレースホルダー `https://komorebi-coffee.example.com` を使用。**公開時にはこの文字列をリポジトリ全体で実ドメインに一括置換すること**（`grep -rl komorebi-coffee.example.com .` で対象ファイルを列挙できる）。
- **シェア表示確認（X/Facebookデバッガー）**: 実際に公開されたURLが必要なため、デプロイ後に確認すること。
- **Core Web Vitals実測 / Search Consoleでのフィールドデータ**: 実際のユーザートラフィックが必要なため、公開後の計測が必要（ローカルLighthouseでの実験値は上記の通り良好）。
- **GA4 / Search Console / タグ確認 / コンバージョン計測**: 実際のGA4測定ID（`G-XXXXXXXXXX`）とGoogleアカウントでのサイト所有権確認が必要。導入時は `js/nav.js` と同様に全ページ共通の `<script>` を追加する形が既存構成と馴染みやすい。
- **SSL / HTTPリダイレクト**: 実際のホスティング先（Netlifyなど）とドメイン設定が必要。
- **Cookie同意バナー**: 現状GA4等のトラッキングを導入していないため不要。導入時に法域（個情法・GDPR対象かどうか）に応じて要否を判断すること。
- **フォーム送信先 / 到達確認**: 本サイトに問い合わせフォームは存在しない（ご予約はお電話・Instagram DMのみ、`docs/CONTENTS.md` 記載の設計どおり）。フォームを新設する場合に該当。
- **ダミー残り**: サイト全体が「ポートフォリオ用の架空カフェ」という前提のため、住所・電話番号・オーナー名などのダミー情報は意図的に残している（本ファイル冒頭「プロジェクト概要」参照）。実店舗の情報に差し替えるのは公開直前の別作業。
- **特定商取引法に基づく表記**: 現状オンライン物販・通信販売の機能が無いカフェの紹介サイトのため非該当。将来的にオンラインショップ等を追加した場合は必要になる。

### ユーザー判断が必要な項目（未着手）

- **CSS/JSの完全外部化（インラインstyleの撲滅）**: チェックリストは「HTMLにインラインで記述するのはNG」としているが、本プロジェクトは全ページ・数百箇所で意図的にインラインstyleを使う設計（上記「実装スタイル」参照、これまでのセッションでユーザーの合意のもと踏襲してきた規約）。全面的な外部化は12ファイルすべてを書き直す規模の大改修になり、デザインの見た目を変えずに行うにはリグレッションのリスクも伴うため、今回は着手していない。対応する場合は範囲・進め方について事前に相談すること。

## 作業時の注意点

1. コンテンツ（店名・メニュー・お知らせ本文など）を追加・編集する際は `docs/CONTENTS.md` のトーン（やわらかい・上品・写真主体・説明過多にしない）に合わせる。
2. 新しいセクションやコンポーネントを作る際は、まず `docs/DESIGN.md` に対応する仕様（コンポーネント名・カラー・タイポグラフィ・スペーシング）がないか確認し、あれば従う。ないパターンを新規に作る場合は、既存トーンに合わせた上でユーザーに確認する。
3. 実際の店舗ではないため、住所・電話番号・人名などの個人情報はダミーのまま維持する（実在の情報に書き換えない）。
4. ビルドプロセスがないため、`index.html` などを直接ブラウザで開く、または簡易HTTPサーバー（例: `python3 -m http.server`）で `docs` 以外のルートを配信すれば動作確認できる。
5. レイアウトに関わる変更（グリッド・パディング・ナビゲーションなど）をした際は、基準幅390px（スマホ）と1024px以上（デスクトップ）の両方で見た目を確認すること。ブラウザでの確認が難しい場合は、Playwright（`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` を `executablePath` に指定、globalインストール済みパッケージは `NODE_PATH=/opt/node22/lib/node_modules` で参照可能）でスクリーンショットを撮って確認できる。
6. SEO・パフォーマンス・アクセシビリティの数値を確認したい場合は、ローカルサーバー（`python3 -m http.server`）を起動した状態で `lighthouse`（`npm install -g lighthouse` でインストール可能）を使う。`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome lighthouse http://localhost:8123/<page>.html --chrome-flags="--headless=new --no-sandbox --disable-gpu" --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./out.json --quiet` のように実行し、`out.json` の `categories.*.score` やスコア0の `audits` を確認する。
