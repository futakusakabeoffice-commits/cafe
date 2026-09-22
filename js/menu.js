(() => {
  const CATEGORIES = ["ALL", "COFFEE", "SWEETS", "TAKE OUT"];

  const ITEMS = [
    { cat: "COFFEE", name: "KOMOREBIブレンド", desc: "深煎りのコクと、やわらかな甘い余韻。", price: "550円（税込）", img: "images/menu-blend.jpg" },
    { cat: "COFFEE", name: "シングルオリジン", desc: "日替わりの産地から、豆の個性をじっくりと。", price: "700円（税込）", img: "images/gallery-01.jpg" },
    { cat: "COFFEE", name: "カフェラテ", desc: "深煎りのエスプレッソに、なめらかなミルクを。", price: "600円（税込）", img: "images/gallery-04.jpg" },
    { cat: "SWEETS", name: "木漏れ日ショートケーキ", desc: "ふわふわのスポンジに、いちごをたっぷり。", price: "720円（税込）", img: "images/menu-shortcake.jpg" },
    { cat: "SWEETS", name: "季節のタルト", desc: "旬のフルーツを使った、その時期だけの一品。", price: "価格は店頭・SNSにてご案内", img: "images/menu-seasonal.jpg", limited: true },
    { cat: "SWEETS", name: "焼きたてスコーン", desc: "クロテッドクリームと自家製ジャムを添えて。", price: "420円（税込）", img: "images/gallery-03.jpg" },
    { cat: "TAKE OUT", name: "コーヒー豆 100g", desc: "その日に焙煎した豆を、お好みの挽き方で。", price: "900円（税込）", img: "images/gallery-05.jpg" }
  ];

  let currentCategory = "ALL";
  const filtersEl = document.getElementById("filters");
  const itemsEl = document.getElementById("items");

  function renderFilters() {
    filtersEl.innerHTML = "";
    CATEGORIES.forEach(label => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.className = "filter-btn" + (label === currentCategory ? " active" : "");
      btn.addEventListener("click", () => {
        currentCategory = label;
        renderFilters();
        renderItems();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderItems() {
    const list = currentCategory === "ALL" ? ITEMS : ITEMS.filter(i => i.cat === currentCategory);
    itemsEl.innerHTML = list.map(it => `
      <article style="background:#F4EEE5;border:1px solid #CDBFAE;border-radius:16px;overflow:hidden;display:flex;flex-direction:column">
        <div style="position:relative;aspect-ratio:4/3;overflow:hidden">
          ${it.limited ? '<span style="position:absolute;top:12px;left:12px;z-index:2;background:#D22A2E;color:#fff;border-radius:999px;padding:4px 12px;font-size:12px;letter-spacing:.08em">季節限定</span>' : ""}
          <img src="${it.img}" alt="${it.name}" style="width:100%;height:100%;object-fit:cover;display:block">
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:8px">
          <p style="margin:0;font-family:Jost,sans-serif;font-size:12px;letter-spacing:.18em;color:#6B5B51">${it.cat}</p>
          <h2 style="margin:0;font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.06em">${it.name}</h2>
          <p style="margin:0;font-size:15px;line-height:1.8;color:#3A241B">${it.desc}</p>
          <p style="margin:4px 0 0;font-size:18px;color:#6B5B51">${it.price}</p>
        </div>
      </article>
    `).join("");
  }

  renderFilters();
  renderItems();
})();
