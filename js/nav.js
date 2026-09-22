(() => {
  const openBtns = document.querySelectorAll("[data-drawer-open]");
  const closeBtns = document.querySelectorAll("[data-drawer-close]");
  const drawer = document.querySelector("[data-drawer]");
  const overlay = document.querySelector("[data-drawer-overlay]");
  if (!drawer || !overlay || !openBtns.length) return;

  let lastFocused = null;

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeDrawer();
      return;
    }
    if (e.key === "Tab") {
      const focusables = drawer.querySelectorAll("a, button");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    overlay.hidden = false;
    drawer.removeAttribute("aria-hidden");
    drawer.removeAttribute("inert");
    document.body.classList.add("drawer-locked");
    openBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
    const firstFocusable = drawer.querySelector("a, button");
    if (firstFocusable) firstFocusable.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");
    document.body.classList.remove("drawer-locked");
    openBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
    document.removeEventListener("keydown", onKeydown);
    window.setTimeout(() => {
      overlay.hidden = true;
    }, 300);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  openBtns.forEach((b) => b.addEventListener("click", openDrawer));
  closeBtns.forEach((b) => b.addEventListener("click", closeDrawer));
  overlay.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
})();
