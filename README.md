# 星霧紀行｜Fantasy Character Wiki

以奶白、淡紫、柔粉與金色構成的原創奇幻角色圖鑑。純 HTML、CSS、JavaScript，無框架、無建置步驟、無 API 金鑰與外部載入依賴。

## 開啟與使用

雙擊 `index.html` 即可瀏覽。建議以本機靜態 HTTP 伺服器或 GitHub Pages 使用，讓 localStorage 的來源保持穩定；file:// 的儲存行為依瀏覽器而異。如已安裝 Python，可在專案根目錄執行 `python -m http.server 8080`，再開啟 `http://localhost:8080`。

- 首頁：精緻手繪四境浮島總覽、精選角色、統計與全站搜尋。
- 圖鑑：八位原創角色，搜尋姓名／故事／能力；陣營與職能可同時篩選。
- 詳細資料：年齡、生日、種族、職業、外貌、個性、故事、技能與可點選的人物關係。
- 收藏：卡片愛心與「我的收藏」；重新整理後讀取 localStorage。
- 新增與編輯：從詳細頁編輯任何角色的故事、外貌、性格、所在地區、圖片與人物關係。原始角色檔保留，修改另存本機覆寫層。
- 圖片：選擇既有動漫立繪、通用預設圖，或上傳最多 500 KiB 的 PNG／JPEG／WebP；失效圖片切換為預設圖。
- 人物關係：朋友、戀人、家人、敵人、夥伴；關係是單向敘述，可按類型篩選或聚焦人物。圖中最多顯示八位，清單保留所有關係。
- 主題：右上角月亮／太陽切換，保存偏好。
- 世界地圖：星詠高原、永春秘林、暮影水都、逐風群島，各有原創圖示、故事、角色與事件連結。
- 世界時間線：五筆重要事件，支援年代與類型交叉篩選；可開啟完整內容及人物／地區連結。
- 搜尋：上方全站搜尋涵蓋人物、地區、歷史；圖鑑原有搜尋與陣營／職能／收藏篩選仍保留。
- 典藏室：JSON 匯出及匯入；先驗證與預覽，確認後合併，保留其他現有角色與收藏。

資料存在目前裝置、瀏覽器與網址來源，不會自動同步到其他裝置或寫入 GitHub；可透過 JSON 手動搬移。清除網站資料會刪除收藏及自訂角色；請勿在此保存唯一的故事原稿。儲存不可用或空間不足時會顯示提示。

## 檔案與 LLM Wiki 工作方式

- `index.html`、`style.css`、`world.css`、`script.js`：既有頁面、基礎樣式、延伸區域樣式、互動。
- `data/world.js`、`data/core.js`：地區與事件、資料驗證／遷移／合併。
- `assets/region-icons.svg`、`assets/default-character.svg`：地區圖示與通用預設圖。
- `assets/maps/`：四張精緻地區鳥瞰地圖 JPEG、PNG 原圖與完整生成提示；詳細面板會顯示對應圖片，並提供開啟原圖連結。
- `data/characters.js`：網站角色資料來源。
- `assets/characters/`：八位角色的 AI 生成動漫立繪（JPEG），以角色 ID 命名；生成方式見該資料夾 README。
- `assets/world.svg`：瀏覽器分頁圖示；`assets/character-1.svg`：舊資料相容圖。其餘舊版角色 SVG 與總覽 SVG 已清理。
- [AGENTS.md](AGENTS.md)：中文協作規範與資料格式，修改前先讀。
- `raw/`：不可變來源，包含使用者提供的 LLM Wiki 文章與原創設定快照。
- [wiki/index.md](wiki/index.md)：整理後的知識索引；world、characters、questions、log 分別保存世界、角色、待解問題、追加日誌。
- [tests/report.md](tests/report.md)、`tests/check.cjs`：實際驗證紀錄與可重跑的邏輯測試。
- `.nojekyll`、`.gitignore`：靜態部署與版本控制輔助。

參考所提供 LLM Wiki 文章的三層做法：來源 → 持續整理的 Wiki → AGENTS.md 規範。新來源先保留原件，再更新相關頁面、索引與日誌；查詢從索引開始；定期檢查矛盾、孤立頁、失效連結與資料一致性。本網站不包含線上 LLM，不會自動從 Markdown 產生角色。

## 測試

若有 Node.js：`node tests/check.cjs`。測試使用模擬 DOM／localStorage，不取代真實瀏覽器驗收。實際通過項目與未測試項目請見 [測試報告](tests/report.md)。本次已執行資料與模擬 DOM 整合測試；本機 HTTP 預覽連線逾時，尚未完成真實畫面與手機排版驗證。

## GitHub Pages 部署

目前未發布、沒有遠端網址。環境 PATH 未提供 Git／GitHub CLI。正式推送前須由使用者確認公開範圍與儲存庫名稱，建議 `fantasy-character-wiki`。

1. 安裝 Git 並登入自己的 GitHub 帳號；建立空的公開 Repository。
2. 在本資料夾執行 `git init -b main`，然後 `git add .`、`git commit -m "Build original fantasy character wiki"`。
3. 檢查 `git status` 與內容，確認可公開（raw/ 包含提供的參考文章，若不想公開完整文章，應先調整收錄與連結）。
4. 使用者確認後，執行 `git remote add origin https://github.com/你的帳號/fantasy-character-wiki.git`，再執行 `git push -u origin main`。網址中的帳號必須替換成實際帳號。
5. Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main`／`(root)` → Save。
6. 等待 Pages 完成；開啟 GitHub 顯示的正式網址，通常為 `https://你的帳號.github.io/fantasy-character-wiki/`。這是格式範例，不是已發布網址。
7. 檢查網站、CSS、JS、角色 JPEG 與世界 SVG 均正常，依測試報告完成手機、收藏、新增與主題重載驗收。

所有執行資源使用相對路徑，無需改動 base URL，支援 GitHub Pages 子目錄部署。不要上傳憑證或 .env。Markdown 筆記在 GitHub 上閱讀；Pages 不會把它們自動整合成角色網頁。

## 版本二備份與舊資料遷移

新儲存鍵為 asteria-library-v2，首次讀取既有 asteria-custom-v1、asteria-favorites-v1、asteria-theme-v1，保留原鍵，之後使用版本二快照。原創角色修改寫入 overrides，自訂角色寫入 custom，收藏及主題同時保存；單次儲存成功才更新畫面。若空間不足，修改不會生效，請縮小圖片後重試。

備份格式範例：

```json
{"version":2,"custom":[],"overrides":[],"favorites":["lyra"],"theme":"light"}
```

JSON 包含個人角色、圖片 data URL、原角色修改及偏好；未修改的八位原創角色由專案資料載入，不重複寫入備份。只接受版本二格式，檔案與完整備份上限 8 MiB，自訂角色最多 100 位。重複 ID 的檔案會被拒絕；合併時相同 ID 以備份內容更新，其他本機角色與收藏保留，主題採備份值。建議合併前先匯出目前資料。

若舊資料 JSON 損壞或欄位無效，會提示且保留原始儲存值，不自動覆寫。網站不提供角色刪除或雲端同步，清除網站資料前請先下載備份。

Windows 可使用無安裝預覽腳本：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/serve.ps1
```

預設網址 http://127.0.0.1:8081/，以 Ctrl+C 結束。僅監聽本機；本次環境跨工具 HTTP 連線逾時，未將預覽列為驗證通過。

四境互動總覽已升級為 assets/maps/world-overview.jpg（1536 × 1024），保留地標點擊與四區縮圖切換；原圖存於 originals/world-overview.png，生成提示記錄於 assets/maps/prompts.json。

## 上傳檔案與圖片清理

詳見 [GITHUB_UPLOAD.md](GITHUB_UPLOAD.md)。已移除八張不再使用的舊 SVG，保留所有現用動漫立繪、地圖 JPEG、原圖連結使用的 PNG、分頁圖示與相容圖片。不要只上傳 index.html，也不要遺漏隱藏檔 .nojekyll。
