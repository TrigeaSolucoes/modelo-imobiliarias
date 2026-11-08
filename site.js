// Única interação: escolher um horário monta a mensagem do WhatsApp.
document.querySelectorAll(".agenda").forEach((agenda) => {
  const botao = agenda.querySelector(".agenda-botao");
  const base = new URL(agenda.dataset.whatsapp);
  const negocio = agenda.dataset.negocio;
  agenda.querySelectorAll(".horario").forEach((h) => {
    h.addEventListener("click", () => {
      agenda.querySelectorAll(".horario").forEach((x) => x.setAttribute("aria-pressed", "false"));
      h.setAttribute("aria-pressed", "true");
      base.searchParams.set("text", `Olá! Quero agendar em ${negocio}: ${h.dataset.texto}.`);
      botao.href = base.toString();
      botao.textContent = `Agendar ${h.dataset.texto}`;
    });
  });
});
