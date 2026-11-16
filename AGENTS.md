# Fantasy Character Wiki：AI 協作與知識維護規範

所有代理在修改網站或內容前，必須先閱讀本檔。使用繁體中文溝通與撰寫文件。

## 1. 專案目標
建立原創奇幻角色與世界觀圖鑑：首頁精選、角色搜尋、陣營與職能篩選、詳細設定、人物關係、收藏、自訂角色、明暗主題，以及世界年表。純靜態部署，不需要帳號、API 金鑰或付費服務。

## 2. 技術與目錄
使用 HTML5、CSS3、原生 JavaScript；以傳統 defer script 載入本機資料，避免 file:// 的模組與 fetch 限制。角色立繪為內建 image_gen 生成的本機動漫 JPEG；世界主視覺與備用圖為原創 SVG；無建置步驟。

```text
./
├── AGENTS.md                 # 本規範（schema 層）
├── README.md                 # 操作、測試、部署
├── index.html                # 語意化網站入口
├── style.css                 # RWD、主題、動畫
├── world.css                 # 地圖、關係圖、年表與編輯器樣式
├── script.js                 # 狀態、互動與儲存
├── data/characters.js        # 原創角色基礎資料
├── data/world.js             # 地區與事件
├── data/core.js              # 資料驗證、遷移與合併
├── assets/                  # 本機圖片資源
│   ├── world.svg             # 分頁圖示
│   ├── region-icons.svg      # 地區圖示
│   ├── default-character.svg # 通用預設圖
│   ├── maps/                # 四區 JPEG、PNG originals/、README、prompts.json
│   ├── character-1.svg       # 舊資料相容圖
│   └── characters/         # 八位角色動漫 JPEG 與生成說明
├── raw/                     # 原始資料層，收錄後不得覆寫
│   ├── llm-wiki.txt          # 使用者提供的方法參考
│   ├── original-setting.md  # 原創世界設定初稿
│   └── world-expansion-2026-11-16.md # 地區與事件增補
├── wiki/                    # 可持續維護的知識層
│   ├── index.md             # 分類索引與頁面摘要
│   ├── log.md               # 僅追加的作業日誌
│   ├── world.md             # 世界、陣營、年表
│   ├── characters.md        # 角色索引與關係
│   ├── questions.md         # 待釐清與矛盾
│   └── interactive-atlas.md # 互動系統與資料索引
└── tests/                   # 靜態與瀏覽器測試紀錄
    ├── check.cjs            # Node VM 邏輯檢查
    ├── serve.ps1            # 無外部依賴的本機預覽
    └── report.md
```

## 3. LLM Wiki 三層原則
參考使用者提供的 Karpathy LLM Wiki 文章，不宣稱本專案包含線上 AI。raw/ 是不可變來源；wiki/ 是從來源整理出的交叉連結知識；AGENTS.md 是結構與工作流程。網站讀取 data/characters.js，Markdown 不會自動轉成網頁；變更設定時須同步資料與 Wiki，避免雙重真相。瀏覽器自訂角色只在當前瀏覽器 localStorage，不會回寫專案。

### 納入來源（ingest）
先閱讀原始來源，保留來源檔與來源標示；整理角色、陣營、事件與關係，更新相關 Wiki 及網站資料。每頁附來源相對連結；同步 index.md 的摘要，再在 log.md 追加日期、操作、變更與驗證結果。衝突寫入 questions.md，不擅自把不確定內容當作定論。

### 查詢（query）
先讀 wiki/index.md，再讀相關頁面，回答附來源連結。值得保存的分析整理成 Wiki 頁面並更新索引與日誌；不得編造來源。

### 健康檢查（lint）
檢查孤立頁、失效相對連結、角色 ID 重複、關係指向不存在角色、年代矛盾、未處理問題與資料不同步。提出缺口但不擅自以網路內容覆蓋原創設定。log.md 只追加，不刪改歷史。

## 4. 程式規範
HTML 使用語意區塊、正確標題層次、label、原生 button 與 dialog；操作必須支援鍵盤。CSS 使用自訂變數統一配色，行動優先，避免行內樣式與超大依賴；關係圖節點座標可使用經程式計算的 CSS 自訂變數，不插入使用者 CSS。JS 使用 const/let、具名小函式與事件委派，資料與 DOM 呈現分離。使用者文字以 textContent 或經 escapeHTML 後插入，禁止 eval 與未驗證 HTML。所有資源採 ./ 相對路徑，不以 / 開頭，不引入追蹤、外部字體與執行時 API。

## 5. UI/UX
奶白、淡紫、柔粉、少量金色；精緻紙張與星圖意象，舒適留白、圓角與輕量陰影。繁體中文字體使用系統字體。手機不得橫向溢位；觸控區至少 44px。提供可見焦點、空狀態、結果數量與儲存回饋；主題維持對比；遵守 prefers-reduced-motion。對話框可按 Escape 關閉，關閉後回到觸發元素。

## 6. 角色資料格式
每個角色包含 id（唯一字串）、name、enName、title、faction（星詠庭／森之盟／暮影會／逐風旅團）、type（法師／守護者／遊俠／療癒師）、age、birthday、race、job、appearance、personality、story、abilities（字串陣列）、relationships（{id,type,label} 陣列）、notes、image（本機路徑或受限制的圖片 data URL）、featured（布林）、regionId（地區 ID）。自訂資料另有 custom:true。不得以名稱當主鍵。原始示範至少八名，所有內容原創。

## 7. 新增功能流程
閱讀本規範與索引 → 確認現有行為與資料格式 → 實作最小完整功能 → 同步 Wiki、資料及 README → 測試主要與錯誤路徑 → 追加日誌。不要添加超出需求的框架或服務。

## 8. 修改現有功能
保留既有 localStorage 鍵與 ID；若需更動須支援遷移。不得覆寫使用者角色或清空收藏。儲存讀取須捕捉 JSON 損壞及不可用情況，驗證資料型別，儲存失敗必須提示。不要刪除專案外檔案。外部發布依使用者要求在正式推送前取得確認。

## 9. 測試與修正
執行 JS 語法檢查、資源與 Wiki 連結檢查；可用時以真實瀏覽器驗證搜尋、雙重篩選、收藏與重整、新增與重整、明暗偏好、對話框、空狀態、手機與桌面寬度。每次失敗先修正再重測。tests/report.md 應區分已執行、通過、未執行與限制，不可假稱測試成功。

## 10. GitHub Pages
以儲存庫根目錄部署，無後端與路由重寫。確保大小寫一致、無私人路徑或憑證、所有檔案已納入 Git；發布前檢查 Git 狀態、遠端與登入狀態。由使用者確認儲存庫名稱與正式推送後再建立遠端並推送，設定 Pages main / (root)。發布後檢查公開頁與子資源，只有取得實際網址才回報已發布。

## 11. 互動世界與資料升級規範

- 新增 `data/world.js`（地區與事件）、`data/core.js`（純資料驗證與遷移）、`assets/region-icons.svg`（四地圖示）、`assets/default-character.svg`（通用預設圖）。保留既有角色、立繪與仍有用途的備用圖；無引用的舊圖可依使用者指示清理。
- `#world` 使用精緻點陣總覽圖搭配原生 HTML 地標按鈕、四區清單及詳細面板。地圖不可使用 Emoji 或大量即時運算；手機標籤不得重疊。地區資料使用穩定 ID、名稱、介紹、背景故事、陣營；角色以 regionId 關聯。
- `#relationships` 使用 SVG 連線加 HTML 人物節點與可篩選關係清單。關係為有向資料 `{id,type,label}`，type 為朋友、戀人、家人、敵人、夥伴；舊描述保留並推定類型，不能擅自把現有角色設定成戀人或敵人。所有角色可編輯關係，手機提供等價清單。
- `#history` 事件包含 id、year、type、title、summary、story、characterIds、regionIds；年代／類型交叉篩選，人物與地區可直接開啟。
- 原始 `data/characters.js` 不覆寫；原角色修改另存 overrides。版本 2 完整快照存於 `asteria-library-v2`，首次從既有 v1 收藏、自訂角色、主題讀取並遷移；保留舊鍵。遷移若失敗不覆寫原資料。快照單次寫入成功才更新記憶體，避免部分匯入。
- JSON 匯出包含版本、自訂角色、原角色覆寫、收藏、主題。匯入先完整驗證／預覽，使用者確認合併後才寫入；同 ID 資料以匯入內容更新，但保留其他既有角色、收藏並合併。拒絕未知版本、重複 ID、無效關係與過大資料。不得執行匯入內容。
- 圖片只接受既有本機白名單或受限制的 PNG/JPEG/WebP data URL；上傳最多 500 KiB；失效圖片自動使用專用預設圖。不接受 SVG 上傳或遠端圖片網址。人物文字必須跳脫。
- 新增／編輯表單包括外貌、性格、地區、圖片與關係；保留既有 ID 與其他未改欄位。圖片與匯入錯誤要顯示清楚訊息。
- 全站搜尋涵蓋人物、地區、歷史；圖鑑維持獨立搜尋與陣營／職能／收藏篩選。所有跳轉須正確關閉對話框、移動焦點，支援鍵盤與 reduced-motion。
- 測試必須涵蓋遷移、編輯重載、JSON 往返／合併／惡意輸入、關係與世界連結、儲存失敗；實際瀏覽器與手機測試結果另記於 tests/report.md，不以模擬測試代替。

## 12. 地區圖片規範

四個地區的插畫存於 assets/maps/，PNG 原圖存於其 originals/ 子目錄；使用內建 image_gen 生成，完整提示保存在 prompts.json。data/world.js 每區增加 mapImage、mapOriginal、mapAlt；renderWorld 在詳細面板展示完整比例圖片，提供原圖連結。不要裁掉地圖邊框或把裝飾建築自動寫成正史。總覽改用 assets/maps/world-overview.jpg，原生 HTML 互動地標保留；舊版總覽 SVG 已依使用者指示清理。圖片應使用 lazy loading、尺寸屬性、替代文字與相對路徑；測試必須檢查四區均引用自己的現有圖檔。

四境總覽以左上星詠高原、右上永春秘林、左下暮影水都、右下逐風群島固定佈局，地標座標以百分比覆蓋；不得將圖片裁成不同長寬比而造成定位偏移。總覽原圖存於 assets/maps/originals/world-overview.png，下方地區按鈕提供縮圖，手機維持兩欄。

## 13. 圖片清理與上傳

已刪除舊版 world-map.svg 與 character-2.svg 至 character-8.svg。world.svg 為 favicon，character-1.svg 用於舊版角色資料，必須保留；被刪角色圖路徑在 data/core.js 正規化時改用 default-character.svg，維持舊備份可匯入。PNG originals 仍由地區原圖連結引用，不應刪除或排除上傳。上傳清單見 GITHUB_UPLOAD.md。不要刪除 raw 原始來源；歷史日誌中的舊檔名保留，不表示仍須存在。
