// H.SILVA: evento de interesse em contato. Não identifica venda ou lead confirmado.
document.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[href]");
  if (!anchor || typeof window.gtag !== "function") return;
  let url;
  try { url = new URL(anchor.href, window.location.href); } catch { return; }
  const host = url.hostname.toLowerCase();
  if (host === "wa.me" || host === "api.whatsapp.com" || host === "web.whatsapp.com" || host === "whatsapp.com") {
    window.gtag("event", "whatsapp_click", {
      page_path: window.location.pathname,
      link_location: window.location.pathname,
      contact_channel: "whatsapp"
    });
  }
});
