const header = document.querySelector("#cabecalho");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
