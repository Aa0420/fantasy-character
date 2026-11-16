/* 原創世界增補，原始三個歷史年代維持不變。 */
window.WIKI_WORLD = {
  regions: [
    {id:'astral',mapImage:'./assets/maps/astral.jpg',mapOriginal:'./assets/maps/originals/astral.png',mapAlt:'星詠高原俯瞰地圖：月輪觀星塔、白色星橋、山稜、水晶花園與浮島聚落',name:'星詠高原',enName:'THE ASTRAL HEIGHTS',faction:'星詠庭',icon:'astral',tag:'星辰 · 記憶 · 守望',summary:'月輪之下，觀星塔與白色星橋守望著天穹。',story:'碎星之夜後，最早升起的浮島停留在雲海之上。觀星者沿著星辰落下的軌跡建立高塔，將無法寄達的心願收藏於星盤。如今，古老星核再次回應璃月的聲音；諾爾守護的星橋，也浮現同樣的光紋。',landmark:'月輪觀星塔',climate:'清冷月夜與永恆薄霧'},
    {id:'verdant',mapImage:'./assets/maps/verdant.jpg',mapOriginal:'./assets/maps/originals/verdant.png',mapAlt:'永春秘林俯瞰地圖：千年記憶古樹、盤根浮島、河流瀑布與林間步道',name:'永春秘林',enName:'THE VERDANT SANCTUARY',faction:'森之盟',icon:'verdant',tag:'古樹 · 療癒 · 生命',summary:'河流繞過記憶古樹，失落的春天在花間低語。',story:'古樹的根鬚緊握著一整座浮島，記住每一場雨與每個離去的名字。森靈與花靈在這裡共同守護生命的循環。近年森林邊緣出現無聲的枯萎，希爾梵與芙蘿正在尋找悲傷的源頭。',landmark:'千年記憶古樹',climate:'溫暖微雨與花露晨光'},
    {id:'dusk',mapImage:'./assets/maps/dusk.jpg',mapOriginal:'./assets/maps/originals/dusk.png',mapAlt:'暮影水都俯瞰地圖：紫色暮光下的運河、拱橋、書店與古老檔案區',name:'暮影水都',enName:'THE VIOLET WATERWAYS',faction:'暮影會',icon:'dusk',tag:'月影 · 夢境 · 真相',summary:'運河映著紫色燈火，深夜的書店為夢境留門。',story:'昔日的地下檔案庫，在浮島升起後成為水都的基石。人們將不能公開的往事藏在運河旁的書頁裡。夜翎穿過屋頂傳遞真相，伊芙的修夢店則保管著那些還未能釋懷的記憶。',landmark:'月影拱橋與修夢書店',climate:'漫長暮色與柔和夜雨'},
    {id:'zephyr',mapImage:'./assets/maps/zephyr.jpg',mapOriginal:'./assets/maps/originals/zephyr.png',mapAlt:'逐風群島俯瞰地圖：雲海浮島、流雲燈塔、旅人港、風帆與航路',name:'逐風群島',enName:'THE ZEPHYR ISLES',faction:'逐風旅團',icon:'zephyr',tag:'航路 · 自由 · 相遇',summary:'風帆與燈塔串起漂浮島嶼，每道航線都是新的故事。',story:'這些小島從不在固定的位置，航海者依靠風聲與星燈辨認道路。逐風旅團在島上建立共享書庫與旅人驛站。凱風的羅盤指向未知的第九座島，而米菈正在將新航路一筆筆補進世界地圖。',landmark:'流雲燈塔與旅人港',climate:'明亮海風與流動雲海'}
  ],
  events: [
    {id:'starfall',year:0,type:'災變',title:'碎星之夜',summary:'天穹破裂，大陸升起，星霧時代開始。',story:'墜落的星辰化為浮島，舊世界的道路從此消失。倖存者以星光作為新的曆法起點。這場災變的原因仍未解明，不能將後世角色視為親歷者。',characterIds:[],regionIds:['astral','verdant','dusk','zephyr']},
    {id:'accord',year:612,type:'盟約',title:'四方盟約',summary:'四大陣營共同建立通往浮島的星橋。',story:'星詠庭提供觀測知識，森之盟穩定島嶼根系，暮影會找回舊航線，逐風旅團開拓道路。盟約讓孤島再次相連；一頁失落的記錄，卻成為日後夜翎追查的謎題。',characterIds:[],regionIds:['astral','verdant','dusk','zephyr']},
    {id:'seed',year:1021,type:'探索',title:'古樹的遠行種子',summary:'希爾梵將一粒種子交給逐風旅人。',story:'為了替記憶古樹尋找可以延續生命的土壤，希爾梵將種子交給凱風。芙蘿調製花露，讓它能在漫長旅途中安然入眠。',characterIds:['sylvan','kai','flora'],regionIds:['verdant','zephyr']},
    {id:'letter',year:1023,type:'發現',title:'盟約的缺頁',summary:'夜翎收到一封來自舊檔案庫的密信。',story:'信裡記錄的星橋數量，與公開的四方盟約並不相同。夜翎與伊芙開始追索缺頁，米菈則以書庫裡的古圖提供線索。此事件沒有揭露謎題的最終答案。',characterIds:['raven','eve','mira'],regionIds:['dusk','astral']},
    {id:'awakening',year:1024,type:'發現',title:'回聲甦醒',summary:'沉睡的星核再次發光，八段命運開始交會。',story:'璃月第一次聽見星核呼喚自己的名字。諾爾修補的星橋泛起回聲，森林、夢境與航線也出現相似徵兆。八位角色正在前往各自心中的答案。',characterIds:['lyra','sylvan','raven','flora','noel','eve','kai','mira'],regionIds:['astral','verdant','dusk','zephyr']}
  ]
};
