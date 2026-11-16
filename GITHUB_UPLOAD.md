# GitHub 上傳清單

上傳來源：`D:\Wiki工作資料夾\wiki`。請將此資料夾「裡面的內容」放到 Repository 根目錄，讓 `index.html` 直接位於根目錄，不要再多包一層 `wiki/`。

## 建議上傳：整理後整個專案

```text
Repository 根目錄/
├── index.html
├── style.css
├── world.css
├── script.js
├── .nojekyll
├── .gitignore
├── AGENTS.md
├── README.md
├── GITHUB_UPLOAD.md
├── data/                  # 三個 JavaScript 資料與驗證模組，全數上傳
├── assets/                # 整個資料夾上傳，包含下列內容
│   ├── world.svg          # 瀏覽器分頁圖示
│   ├── character-1.svg    # 舊角色資料相容圖
│   ├── default-character.svg
│   ├── region-icons.svg
│   ├── characters/        # 八張動漫 JPEG 與圖片說明
│   └── maps/              # 五張地圖 JPEG、生成說明及提示
│       └── originals/     # 五張 PNG；原圖連結與圖片說明會使用
├── wiki/                  # 頁尾的世界設定筆記及相對連結
├── raw/                   # Wiki 引用的原始文章與設定來源
└── tests/                 # 測試腳本、預覽腳本與報告
```

## 哪些是網站必需檔案？

| 檔案／資料夾 | 用途 |
| --- | --- |
| index.html | 網站入口 |
| style.css、world.css | 頁面與互動世界樣式 |
| script.js | 搜尋、地圖、關係圖、時間線、儲存、匯入匯出 |
| data/ 全部檔案 | 角色、世界及資料驗證；缺少任何一個可能導致無法初始化 |
| assets/ 所有圖片 | 立繪、地圖、圖示、相容圖；PNG 原圖也有連結 |
| .nojekyll | 保持原生靜態檔案部署 |
| wiki/ | 網站頁尾的「世界設定筆記」連結 |

AGENTS.md、README.md、GITHUB_UPLOAD.md、raw/、tests/、圖片生成說明與 prompts.json 不參與主介面執行，但可保留完整 Wiki 來源、文件與測試紀錄。建議一起上傳，讓文件中的相對連結也保持有效；raw/ 包含你提供的 LLM Wiki 參考文章，上傳公開 Repository 後也會公開。

## 不必上傳

- `node_modules/`、`.env`、`.env.*`、系統縮圖與暫存檔：已有 .gitignore 規則。
- `.git/`：使用 Git 時由 Git 自行管理，不要以網頁拖曳上傳此目錄。
- 專案外的生成圖片快取、電腦截圖與附件：網站已使用專案內的正式圖片。
- 從網站匯出的個人 JSON 備份：自行保管即可；不會因為上傳程式而自動同步收藏或自訂角色。

目前不需要 package.json、打包產物、API 金鑰或任何伺服器程式。

## 本次已刪除

- assets/world-map.svg：舊版幾何總覽，已由 world-overview.jpg 取代。
- assets/character-2.svg 至 character-8.svg：七張舊版角色示意圖，已由動漫 JPEG 取代。

共八個檔案、21,733 bytes（約 21.2 KiB）。如果舊備份仍引用已刪的角色示意圖，匯入時會改用通用預設圖；角色文字、ID、收藏與關係不受影響。

## Pages 根目錄與資料保存

既有部署步驟見 [README.md](README.md)。設定部署來源時，根目錄應直接包含 index.html，所有相對路徑保持原樣。若透過檔案總管挑選上傳，請確認 .nojekyll 及 .gitignore 等隱藏檔一併上傳。

GitHub 上傳只發布專案中八位預設角色及程式資料。瀏覽器 localStorage 中的自訂角色、編輯與收藏需先在網站匯出 JSON，再於正式網址手動匯入；它們不會自動出現在檔案資料夾。

本次只完成本機整理與清單，尚未建立 Repository、推送或發布。
