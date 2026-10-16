const $ = id => document.getElementById(id);
const load = f => fetch(f).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

load("assets/projects/projects.json").then(list => {
  const grid = $("grid");
  if (!list.length) { grid.innerHTML = '<p class="note">No projects yet. Add entries to assets/projects/projects.json.</p>'; return; }
  grid.innerHTML = list.map((p, i) => `
    <button class="card" data-i="${i}">
      ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : '<div class="ph"></div>'}
      <div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div>
    </button>`).join("");
  grid.addEventListener("click", e => {
    const c = e.target.closest(".card"); if (!c) return;
    const p = list[c.dataset.i];
    $("viewer-img").src = p.image || ""; $("viewer-img").alt = p.title;
    $("viewer-title").textContent = p.title; $("viewer-desc").textContent = p.description || "";
    const a = $("viewer-link"); a.hidden = !p.link; if (p.link) a.href = p.link;
    $("viewer").showModal();
  });
}).catch(() => $("grid").innerHTML = '<p class="note">Could not load assets/projects/projects.json. Check that the file exists and is valid JSON.</p>');

load("team.json").then(list => {
  $("team-list").innerHTML = list.length
    ? list.map(m => `<li><span>${esc(m.name)}</span><small>${esc([m.roll, m.role].filter(Boolean).join(" · "))}</small></li>`).join("")
    : '<li class="note">No team members yet. Add entries to team.json.</li>';
}).catch(() => $("team-list").innerHTML = '<li class="note">Could not load team.json. Check that the file exists and is valid JSON.</li>');

$("close").onclick = () => $("viewer").close();
$("viewer").addEventListener("click", e => { if (e.target === $("viewer")) $("viewer").close(); });

// Falling / rising OM symbols (minimal, slow, low opacity)
(() => {
  const layer = $("om-layer");
  if (!layer || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const count = innerWidth < 600 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = "ॐ";
    const up = i % 2 === 1;
    s.className = up ? "om up" : "om down";
    s.style.left = (Math.random() * 96) + "%";
    s.style.fontSize = (16 + Math.random() * 26) + "px";
    s.style.setProperty("--o", (0.08 + Math.random() * 0.14).toFixed(2));
    s.style.setProperty("--dx", ((Math.random() - 0.5) * 120).toFixed(0) + "px");
    s.style.setProperty("--r", ((Math.random() - 0.5) * 50).toFixed(0) + "deg");
    s.style.animationDuration = (28 + Math.random() * 28).toFixed(1) + "s";
    s.style.animationDelay = "-" + (Math.random() * 50).toFixed(1) + "s";
    layer.appendChild(s);
  }
})();
