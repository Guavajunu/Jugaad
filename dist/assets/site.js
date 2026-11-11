/* Progressive enhancement only: all pages and content work without this script. */
(function () {
  var mb = document.getElementById("mb"), menu = document.getElementById("menu");
  if (mb && menu) {
    mb.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      mb.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { menu.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.focus(); }
    });
  }
  var f = document.getElementById("f");
  if (!f) return;
  var $ = function (s) { return document.querySelector(s); };
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, EMAIL = f.dataset.email, WA = f.dataset.wa;
    function chk(id, msg, bad) {
      var el = $("#" + id), er = el.parentElement.querySelector(".err");
      var b = bad ? bad(el) : !el.value.trim();
      el.setAttribute("aria-invalid", String(b));
      if (er) er.textContent = b ? msg : "";
      if (b) ok = false;
    }
    chk("nm", "Please enter your name.");
    chk("em", "Please enter a valid email address.", function (el) { return !/^\S+@\S+\.\S+$/.test(el.value); });
    chk("co", "Please enter your country.");
    chk("ds", "Please describe the situation briefly.");
    var cs = $("#cs");
    cs.parentElement.parentElement.querySelector(".err").textContent = cs.checked ? "" : "Please tick to consent.";
    if (!cs.checked) ok = false;
    var st = $("#st"); st.style.display = "block";
    if (!ok) { st.textContent = "Please correct the highlighted fields."; st.style.borderColor = "var(--brick)"; return; }
    var ar = Array.prototype.map.call(document.querySelectorAll("[name=ar]:checked"), function (x) { return x.value; }).join(", ") || "Not specified";
    var body = "Name: " + $("#nm").value + "\nEmail: " + $("#em").value + "\nPhone: " + $("#ph").value + "\nOrganisation: " + $("#og").value + "\nCountry: " + $("#co").value + "\nAreas: " + ar + "\nPreferred contact: " + $("#pc").value + "\n\n" + $("#ds").value;
    st.style.borderColor = "var(--olive)";
    st.innerHTML = 'Your email app should now open with the enquiry drafted. <b>It has not been sent yet</b>, so please press send there. If nothing opens, write to <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or use <a href="https://wa.me/' + WA + '">WhatsApp</a>.';
    /* TODO: if a form service is configured (CFG.formEndpoint), POST here and show success only on a 2xx response. */
    location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Website enquiry — " + $("#nm").value) + "&body=" + encodeURIComponent(body);
  });
})();
