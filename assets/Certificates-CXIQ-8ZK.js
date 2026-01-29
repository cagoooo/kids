import{c as x,r as l,j as e,B as S}from"./index-n-EY8GTy.js";import{T as y,S as C,L as z,a as f,m as g}from"./Layout-D_yaY9ik.js";import{u as E}from"./useQuery-Bqjn5xqP.js";import{I as q}from"./input-CAKYNKOk.js";import{u as T}from"./use-tts-DPGGw7V0.js";import{L as A}from"./lock-BeSzguN2.js";const I=x("Crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]]);const L=x("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);const M=x("Medal",[["path",{d:"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",key:"143lza"}],["path",{d:"M11 12 5.12 2.2",key:"qhuxz6"}],["path",{d:"m13 12 5.88-9.8",key:"hbye0f"}],["path",{d:"M8 7h8",key:"i86dvs"}],["circle",{cx:"12",cy:"17",r:"5",key:"qbz8iq"}],["path",{d:"M12 18v-2h-.5",key:"fawc4q"}]]),u=[{id:"math_master",title:"數學小達人",description:"在數學樂園獲得 100 分",icon:y,color:"text-yellow-500",bgColor:"bg-yellow-100",requirement:{type:"score",value:100}},{id:"word_explorer",title:"單字探險家",description:"在單字探險獲得 100 分",icon:M,color:"text-blue-500",bgColor:"bg-blue-100",requirement:{type:"score",value:100}},{id:"sticker_collector",title:"貼紙收藏家",description:"收集 10 張貼紙",icon:C,color:"text-pink-500",bgColor:"bg-pink-100",requirement:{type:"stickers",value:10}},{id:"super_kid",title:"小超人",description:"收集 20 張貼紙",icon:I,color:"text-purple-500",bgColor:"bg-purple-100",requirement:{type:"stickers",value:20}}],_="kidszone_stickers",m="kidszone_achievements";function U(){const[a,b]=l.useState(""),[w,p]=l.useState([]),[r,v]=l.useState(null),k=l.useRef(null),{speak:c}=T(),{data:d}=E({queryKey:["/api/scores"]});l.useEffect(()=>{const t=localStorage.getItem(m);t&&p(JSON.parse(t)),j()},[d]);const j=()=>{const t=localStorage.getItem(_),s=t?JSON.parse(t).length:0,i=[];if(u.forEach(o=>{o.requirement.type==="stickers"?s>=o.requirement.value&&i.push(o.id):o.requirement.type==="score"&&d&&d.some(n=>n.score>=o.requirement.value)&&i.push(o.id)}),i.length>0){const o=localStorage.getItem(m),h=o?JSON.parse(o):[],n=[...new Set([...h,...i])];localStorage.setItem(m,JSON.stringify(n)),p(n)}},N=()=>{if(!r||!a.trim()){c("請先輸入你的名字！");return}const t=window.open("","_blank");if(!t)return;r.icon;const s=new Date().toLocaleDateString("zh-TW");t.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>小超人證書 - ${a}</title>
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
          <div class="name">${a}</div>
          <div class="achievement">${r.title}</div>
          <div class="achievement" style="font-size: 18px; color: #888;">${r.description}</div>
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
    `),t.document.close()};return e.jsx(z,{children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4",children:[e.jsxs("div",{className:"text-center space-y-2 sm:space-y-4",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 sm:gap-3",children:[e.jsx(f,{className:"w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]"}),e.jsx("h1",{className:"font-display text-2xl sm:text-4xl md:text-5xl font-black text-[hsl(var(--macaron-purple-dark))]",children:"小超人證書"}),e.jsx(f,{className:"w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]"})]}),e.jsx("p",{className:"text-sm sm:text-base text-muted-foreground font-medium",children:"完成挑戰獲得專屬證書！可以列印出來貼在牆上喔！"})]}),e.jsxs("div",{className:"bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-white",children:[e.jsx("h2",{className:"font-display text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6",children:"成就徽章"}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4",children:u.map(t=>{const s=w.includes(t.id),i=t.icon;return e.jsxs(g.button,{whileHover:{scale:s?1.05:1},whileTap:{scale:s?.95:1},onClick:()=>{s?(v(t),c(t.title)):c("還沒解鎖喔！繼續加油！")},className:`
                    p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 transition-all
                    ${s?`${t.bgColor} shadow-lg cursor-pointer ring-2 ring-white`:"bg-gray-200 cursor-not-allowed opacity-60"}
                    ${r?.id===t.id?"ring-4 ring-yellow-400":""}
                  `,"data-testid":`achievement-${t.id}`,children:[e.jsx("div",{className:`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                    ${s?"bg-white shadow-md":"bg-gray-300"}
                  `,children:s?e.jsx(i,{className:`w-6 h-6 sm:w-8 sm:h-8 ${t.color}`}):e.jsx(A,{className:"w-5 h-5 sm:w-6 sm:h-6 text-gray-400"})}),e.jsx("span",{className:"text-xs sm:text-sm font-bold text-center",children:t.title}),e.jsx("span",{className:"text-xs text-gray-500 text-center hidden sm:block",children:t.description})]},t.id)})})]}),e.jsxs(g.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-yellow-200",children:[e.jsx("h2",{className:"font-display text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6",children:"列印你的證書"}),e.jsxs("div",{ref:k,className:"bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-4 border-dashed border-yellow-300 text-center",children:[e.jsx("div",{className:"text-2xl sm:text-3xl mb-2",children:"小超人證書"}),e.jsx("div",{className:"text-4xl sm:text-5xl my-4",children:e.jsx(y,{className:"w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-500"})}),e.jsx("div",{className:"text-base sm:text-lg text-gray-600 mb-2",children:"恭喜獲得"}),e.jsx("div",{className:"text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2",children:a||"你的名字"}),e.jsx("div",{className:"text-lg sm:text-xl font-bold text-gray-700",children:r?.title||"選擇一個成就"}),e.jsx("div",{className:"text-sm text-gray-500 mt-2",children:r?.description||"點擊上方已解鎖的成就徽章"})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center",children:[e.jsx(q,{type:"text",placeholder:"輸入你的名字",value:a,onChange:t=>b(t.target.value),className:"max-w-xs text-center text-base sm:text-lg","data-testid":"input-player-name"}),e.jsxs(S,{onClick:N,disabled:!a.trim()||!r,"data-testid":"button-print",children:[e.jsx(L,{className:"w-5 h-5 mr-2"}),"列印證書"]})]}),!r&&e.jsx("p",{className:"text-center text-sm text-gray-500 mt-4",children:"請先點擊上方已解鎖的成就徽章"})]}),e.jsxs("div",{className:"text-center text-sm sm:text-base text-gray-500 space-y-1",children:[e.jsx("p",{children:"完成遊戲達到目標分數或收集貼紙，就可以解鎖成就！"}),e.jsx("p",{children:"點選已解鎖的成就，輸入名字就可以列印專屬證書！"})]})]})})}export{U as default};
