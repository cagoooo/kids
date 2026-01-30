import{r as a,j as e,B as S}from"./index-BKJHQ17t.js";import{T as d,S as C,L as z,a as u,m as h}from"./Layout-BFBCft2f.js";import{I as E}from"./input-BcmEp2LU.js";import{u as T}from"./use-tts-BEkRPK4K.js";import{M as A,C as _}from"./medal-BEdnH-Oc.js";import{L as I}from"./lock-B0N0huxB.js";import{D as $}from"./download-DcnxfK3i.js";const b=[{id:"math_master",title:"數學小達人",description:"在數學樂園獲得 100 分",icon:d,color:"text-yellow-500",bgColor:"bg-yellow-100",requirement:{type:"score",value:100}},{id:"word_explorer",title:"單字探險家",description:"在單字探險獲得 100 分",icon:A,color:"text-blue-500",bgColor:"bg-blue-100",requirement:{type:"score",value:100}},{id:"sticker_collector",title:"貼紙收藏家",description:"收集 10 張貼紙",icon:C,color:"text-pink-500",bgColor:"bg-pink-100",requirement:{type:"stickers",value:10}},{id:"super_kid",title:"小超人",description:"收集 20 張貼紙",icon:_,color:"text-purple-500",bgColor:"bg-purple-100",requirement:{type:"stickers",value:20}}],q="kidszone_stickers",x="kidszone_achievements";function K(){const[l,g]=a.useState(""),[w,p]=a.useState([]),[o,y]=a.useState(null),v=a.useRef(null),{speak:m}=T(),[n,j]=a.useState([]);a.useEffect(()=>{try{const s=localStorage.getItem("kidszone_scores");s&&j(JSON.parse(s))}catch(s){console.error("Failed to load scores from localStorage",s)}const t=localStorage.getItem(x);t&&p(JSON.parse(t))},[]),a.useEffect(()=>{n.length>0&&N()},[n]);const N=()=>{const t=localStorage.getItem(q),s=t?JSON.parse(t).length:0,i=[];if(b.forEach(r=>{r.requirement.type==="stickers"?s>=r.requirement.value&&i.push(r.id):r.requirement.type==="score"&&n&&n.some(c=>c.score>=r.requirement.value)&&i.push(r.id)}),i.length>0){const r=localStorage.getItem(x),f=r?JSON.parse(r):[],c=[...new Set([...f,...i])];localStorage.setItem(x,JSON.stringify(c)),p(c)}},k=()=>{if(!o||!l.trim()){m("請先輸入你的名字！");return}const t=window.open("","_blank");if(!t)return;o.icon;const s=new Date().toLocaleDateString("zh-TW");t.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>小超人證書 - ${l}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Noto Sans TC', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
          }
          .certificate {
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #fff9e6 0%, #fff 50%, #e6f3ff 100%);
            border: 8px solid #ffd700;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .corner { position: absolute; font-size: 40px; }
          .corner-tl { top: 20px; left: 20px; }
          .corner-tr { top: 20px; right: 20px; }
          .corner-bl { bottom: 20px; left: 20px; }
          .corner-br { bottom: 20px; right: 20px; }
          .header { font-size: 48px; color: #ff6b6b; margin-bottom: 20px; }
          .award-icon { font-size: 80px; margin: 20px 0; }
          .title { font-size: 36px; color: #4a4a4a; margin: 20px 0; }
          .name { font-size: 48px; color: #6b5ce7; font-weight: bold; margin: 30px 0; }
          .achievement { font-size: 24px; color: #666; margin: 20px 0; }
          .date { font-size: 18px; color: #888; margin-top: 40px; }
          .footer { font-size: 20px; color: #ff9f43; margin-top: 20px; }
          @media print {
            body { background: white; }
            .certificate { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <span class="corner corner-tl">⭐</span>
          <span class="corner corner-tr">⭐</span>
          <span class="corner corner-bl">⭐</span>
          <span class="corner corner-br">⭐</span>
          
          <div class="header">🎉 小超人證書 🎉</div>
          <div class="award-icon">🏆</div>
          <div class="title">恭喜獲得</div>
          <div class="name">${l}</div>
          <div class="achievement">${o.title}</div>
          <div class="achievement" style="font-size: 18px; color: #888;">${o.description}</div>
          <div class="date">頒發日期：${s}</div>
          <div class="footer">童樂學園 KidsZone</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `),t.document.close()};return e.jsx(z,{children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4",children:[e.jsxs("div",{className:"text-center space-y-2 sm:space-y-4",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 sm:gap-3",children:[e.jsx(u,{className:"w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]"}),e.jsx("h1",{className:"font-display text-2xl sm:text-4xl md:text-5xl font-black text-[hsl(var(--macaron-purple-dark))]",children:"小超人證書"}),e.jsx(u,{className:"w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]"})]}),e.jsx("p",{className:"text-sm sm:text-base text-muted-foreground font-medium",children:"完成挑戰獲得專屬證書！可以列印出來貼在牆上喔！"})]}),e.jsxs("div",{className:"bg-[#5d4037] p-6 sm:p-8 rounded-[2rem] shadow-2xl border-b-8 border-[#3e2723] relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"}),e.jsxs("h2",{className:"font-display text-2xl sm:text-3xl font-black text-center mb-8 text-[#ffecb3] drop-shadow-md flex items-center justify-center gap-3",children:[e.jsx(d,{className:"text-yellow-400 fill-current animate-bounce"}),"榮譽展示櫃",e.jsx(d,{className:"text-yellow-400 fill-current animate-bounce delay-100"})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10",children:b.map(t=>{const s=w.includes(t.id),i=t.icon;return e.jsxs("div",{className:"flex flex-col items-center group relative",children:[e.jsx("div",{className:"absolute bottom-[-10px] w-full h-4 bg-[#795548] rounded-full shadow-lg z-0"}),e.jsxs(h.button,{whileHover:{scale:s?1.1:1,y:-10},whileTap:{scale:s?.95:1},onClick:()=>{s?(y(t),m(t.title)):m("還沒解鎖喔！繼續加油！")},className:`
                        relative z-10 w-full aspect-square flex flex-col items-center justify-center p-2 transition-all duration-500
                        ${s?"cursor-pointer":"cursor-not-allowed grayscale opacity-70"}
                      `,"data-testid":`achievement-${t.id}`,children:[s&&e.jsx("div",{className:"absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"}),e.jsx("div",{className:`
                        w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 shadow-xl transform transition-transform
                        ${s?`bg-gradient-to-br from-white to-${t.bgColor.replace("bg-","")} border-white ring-4 ring-yellow-300/50`:"bg-gray-200 border-gray-300"}
                      `,children:s?e.jsx(i,{className:`w-10 h-10 sm:w-12 sm:h-12 ${t.color} drop-shadow-md`}):e.jsx(I,{className:"w-8 h-8 sm:w-10 sm:h-10 text-gray-400"})}),e.jsx("div",{className:"mt-4 bg-[#ffecb3] text-[#5d4037] px-3 py-1 rounded-md shadow-md border-b-2 border-[#ffca28] min-w-[100px] text-center",children:e.jsx("span",{className:"text-xs sm:text-sm font-black block",children:t.title})})]})]},t.id)})})]}),e.jsxs(h.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-yellow-200",children:[e.jsx("h2",{className:"font-display text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6",children:"列印你的證書"}),e.jsxs("div",{ref:v,className:"bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-4 border-dashed border-yellow-300 text-center",children:[e.jsx("div",{className:"text-2xl sm:text-3xl mb-2",children:"小超人證書"}),e.jsx("div",{className:"text-4xl sm:text-5xl my-4",children:e.jsx(d,{className:"w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-500"})}),e.jsx("div",{className:"text-base sm:text-lg text-gray-600 mb-2",children:"恭喜獲得"}),e.jsx("div",{className:"text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2",children:l||"你的名字"}),e.jsx("div",{className:"text-lg sm:text-xl font-bold text-gray-700",children:o?.title||"選擇一個成就"}),e.jsx("div",{className:"text-sm text-gray-500 mt-2",children:o?.description||"點擊上方已解鎖的成就徽章"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center",children:[e.jsx(E,{type:"text",placeholder:"輸入你的名字",value:l,onChange:t=>g(t.target.value),className:"max-w-xs text-center text-base sm:text-lg","data-testid":"input-player-name"}),e.jsxs(S,{onClick:k,disabled:!l.trim()||!o,"data-testid":"button-print",children:[e.jsx($,{className:"w-5 h-5 mr-2"}),"列印證書"]})]}),!o&&e.jsx("p",{className:"text-center text-sm text-gray-500 mt-4",children:"請先點擊上方已解鎖的成就徽章"})]}),e.jsxs("div",{className:"text-center text-sm sm:text-base text-gray-500 space-y-1",children:[e.jsx("p",{children:"完成遊戲達到目標分數或收集貼紙，就可以解鎖成就！"}),e.jsx("p",{children:"點選已解鎖的成就，輸入名字就可以列印專屬證書！"})]})]})})}export{K as default};
