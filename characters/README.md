# 動漫角色圖片

生成日期：2026-11-16。使用內建 **image_gen**，不是 CLI／付費 API 整合；網站使用時不會呼叫生成服務。

每張圖片獨立生成，經人工查看輸出確認主要外貌與道具；將工具原始 PNG 編碼為品質 88 的 JPEG，保留完整方形構圖，未裁切。原始 PNG 留在工具預設 generated_images 位置，部署只需要本資料夾 JPEG。

| 檔案 | 角色 | 最終生成提示的角色設定 |
| --- | --- | --- |
| lyra.jpg | 璃月 | 24 歲成年女性、銀紫長髮、淡金眼睛、星圖披肩、奶白淡紫法師服、手持古老星盤、月光觀星塔 |
| sylvan.jpg | 希爾梵 | 成年男性森靈、苔綠長髮、尖耳、枝葉冠冕、綠色金繡守衛披風、肩上小鳥、古森林 |
| raven.jpg | 夜翎 | 27 歲成年男性、深藍短髮、銀耳扣、午夜羽飾斗篷、信使服、手持封蠟信、月夜屋頂 |
| flora.jpg | 芙蘿 | 32 歲成年女性花靈、粉色捲髮、開朗表情、奶白襯衣與玫瑰圍裙、種子玻璃瓶、花露、花園 |
| noel.jpg | 諾爾 | 29 歲成年男性騎士、奶金短髮、溫柔正直表情、奶白金色修補輕甲、淡紫披風、盾牌、日出星橋 |
| eve.jpg | 伊芙 | 明確成年女性夢境魔女、黑紫長髮、溫柔神祕微笑、紫色象牙蕾絲服、垂掛金月亮的寬簷帽、夢境光球、月夜書店 |
| kai.jpg | 凱風 | 22 歲成年男性翼族旅人、銅棕短髮、青色圍巾、奶白襯衣棕皮外套、肩後羽翼、羅盤、浮島雲海 |
| mira.jpg | 米菈 | 26 歲成年女性學者、灰藍長髮、圓框眼鏡、奶白襯衣灰藍旅行披風、黃銅星燈、書籍與浮島 |

共同最終風格提示：Original Japanese anime fantasy portrait; single waist-up character; complete head within square frame; fine clean anime linework; expressive eyes; polished light novel art; soft painterly cel shading; dreamy pastel palette with ivory, lavender and gold accents; no text; no watermark.

每張以共同提示搭配表內對應角色設定獨立提交。角色圖用於首頁精選、圖鑑卡片、詳細資料；自訂角色仍使用既有共用 SVG 備用圖，不會自動生成圖片。
