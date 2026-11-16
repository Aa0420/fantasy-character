# 作業日誌

返回[索引](index.md)。本檔僅追加紀錄。

## [2026-11-16] ingest | LLM Wiki 方法與原創設定

保留使用者提供文章至 raw/llm-wiki.txt；先建立中文 AGENTS.md，再建立不可變設定快照、世界與角色索引、問題清單。完成八名原創角色、純靜態網站及本機 SVG 資源。測試結果另見 [報告](../tests/report.md)。

## [2026-11-16] lint | 網站與知識層檢查

通過 JS 語法、本機資源、唯一 ID、人物關係、Wiki 連結及模擬 DOM 的搜尋／交叉篩選／收藏／新增／主題重載檢查。保存 tests/check.cjs 並重跑通過。真實瀏覽器預覽遭 file:// 政策阻擋，未驗證手機視覺；Git 與 gh 不在 PATH，未建立遠端或發布。完成 README 與測試報告。

## [2026-11-16] assets | 動漫角色立繪

使用內建 image_gen 分別生成八位角色圖片，保留各自外貌設定。網頁 JPEG 集中於 assets/characters/，資料引用已更新；原始生成 PNG 保留於工具輸出位置。JPEG 共約 3.44 MiB，單張約 372–479 KiB。同步 AGENTS.md 與 README，生成提示見圖片資料夾 README。

## [2026-11-16] ingest | 四境世界增補與互動 Wiki

新增不可變來源 raw/world-expansion-2026-11-16.md，整理四地區及 1021／1023 兩筆增補事件；保留原有三筆年代與八名角色。更新世界、人物、待解問題、索引，新增 interactive-atlas.md。地圖、圖示與通用角色圖使用原創本機 SVG。

## [2026-11-16] lint | 地圖、關係、編輯與備份驗證

完成互動地圖、可篩選關係圖與年表、全站搜尋、所有角色編輯、受限圖片上傳、預設圖、JSON 預覽與合併。資料層採版本二原子快照，保留版本一鍵與原角色資料。通過 11 組同步模擬測試與非同步匯入／匯出流程，SVG XML 與資源／Wiki 連結檢查正常。修正圖片切換、上傳忙碌狀態、圖形比例、聚焦排序及遷移容錯。本機 HTTP 與內建瀏覽器連線逾時，真實畫面與手機操作未完成驗證；詳見 tests/report.md。未發布。

## [2026-11-16] assets | 四區精細鳥瞰地圖

使用內建 image_gen 分別生成四區原創手繪地圖；PNG 原圖與品質 90 JPEG 保存於 assets/maps/，最終逐字提示存於 prompts.json。新增 world.js 的 mapImage、mapOriginal、mapAlt，地區面板展示對應圖片並提供完整圖連結；保留 SVG 總覽與所有既有互動。圖片可解碼與尺寸檢查通過，12 組同步測試與非同步整合測試通過；實際瀏覽器渲染未重測。

## [2026-11-16] assets | 精緻四境總覽取代幾何示意圖

依使用者截圖，使用內建 image_gen 生成統一水彩鳥瞰總覽。JPEG 與 PNG 分別保存於 assets/maps/world-overview.jpg、assets/maps/originals/world-overview.png，完整提示追加至 prompts.json。替換首頁與互動地圖主圖，校準四區百分比地標，加入地區縮圖卡與香檳金視覺細節，保留所有資料與互動。12 組同步及非同步整合測試通過；未重做真實瀏覽器畫面驗證。

## [2026-11-16] maintenance | 清理舊圖片與 GitHub 上傳清單

依使用者要求，核對執行程式、圖片白名單、Wiki 與文件引用後，刪除 world-map.svg、character-2.svg 至 character-8.svg，共八檔 21,733 bytes。保留現用圖片、favicon、相容圖與原圖連結。舊角色圖片路徑由資料正規化轉為通用預設圖；不修改原始角色、來源文件或儲存鍵。新增 GITHUB_UPLOAD.md，說明完整與執行必需清單。回歸與檔案連結檢查通過；未發布。
