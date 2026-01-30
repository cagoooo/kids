# KidsZone Learning Games (童樂學園)

## v1.0.1 更新日誌 (2026/01/30)
- ✅ **手機體驗優化**：修復白屏問題，加入 Error Boundary 防護。
- ✅ **離線模式支援**：分數系統改用 LocalStorage，支援 GitHub Pages 靜態部署與離線遊玩。
- ✅ **PWA 升級**：更新應用程式圖示，修復 Manifest 警告。
- ✅ **錯誤修復**：過濾 TTS 語音干擾錯誤，提升穩定性。
- ✅ **開發體驗**：修復本地開發 Firebase API Key 與 WebSocket 連線問題。


這是一個使用 React 和 Express 構建的兒童教育遊戲平台，包含 13 個繁體中文互動學習遊戲。

## 🎮 遊戲內容

本平台包含以下領域的學習遊戲：
- **核心科目**：顏色、數學、英語詞彙、形狀、時鐘閱讀
- **語言**：注音符號、旋律識別
- **生活技能**：情緒識別、程式設計基礎、植物生長、購物/金錢計算、資源回收、記憶訓練

## 🛠️ 技術架構

- **前端**：React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **後端**：Express.js, Node.js
- **資料庫**：PostgreSQL (使用 Drizzle ORM)
- **其他**：TanStack Query, Framer Motion, dnd-kit

## 🚀 安裝與執行 (本地開發)

### 前置需求
- Node.js (建議 v18 或以上)
- PostgreSQL 資料庫

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
請在根目錄建立 `.env` 檔案，並填入以下資訊：
```env
DATABASE_URL=postgresql://username:password@localhost:5432/kidszone
PORT=5000
```

### 3. 資料庫遷移
```bash
npm run db:push
```

### 4. 啟動開發伺服器
```bash
npm run dev
```
啟動後，前端與後端將同時運行。

## 📦 部署說明

### 部署至 GitHub Pages (限制)
由於本專案包含後端 (Express) 與資料庫 (PostgreSQL)，**無法直接完整部署至 GitHub Pages**。GitHub Pages 僅支援靜態網頁。

若要部署至 GitHub Pages，您有以下選擇：
1.  **僅部署前端**：需修改程式碼，移除或模擬後端 API (排行榜功能將失效或需改用 Firebase/LocalStorage)。
2.  **完整部署 (推薦)**：使用支援全端應用的平台，如 Render, Railway, 或 Fly.io。

### 部署至 Replit
本專案已針對 Replit 優化，可直接 Import Repository 至 Replit 運行。

## 📂 專案結構
- \`client/\`: 前端程式碼
- \`server/\`: 後端 API 與資料庫邏輯
- \`shared/\`: 前後端共用的型別與驗證 Schema
- \`script/\`: 建置腳本

## 📜 授權
MIT License
