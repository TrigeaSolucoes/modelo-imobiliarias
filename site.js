(function () {
  function montarUrlZap(numero, texto) {
    var digitos = "55" + String(numero || "").replace(/\D/g, "");
    return "https://wa.me/" + digitos + "?text=" + encodeURIComponent(texto);
  }

  // 1. Busca multicritério (abas Comprar/Alugar + filtros + tags rápidas)
  var formBusca = document.getElementById("form-busca-imoveis");
  var btnBuscar = document.getElementById("btn-buscar-imoveis");
  var abasMod = document.querySelectorAll(".aba-mod");
  var selBairro = document.getElementById("f-bairro");
  var selTipo = document.getElementById("f-tipo");
  var selQuartos = document.getElementById("f-quartos");
  var selPreco = document.getElementById("f-preco");
  var modAtual = "Comprar";

  function atualizarBusca() {
    if (!formBusca || !btnBuscar) return;
    var zap = formBusca.getAttribute("data-zap");
    var bairro = selBairro ? selBairro.value : "Qualquer bairro";
    var tipo = selTipo ? selTipo.value : "Apartamento ou casa";
    var quartos = selQuartos ? selQuartos.value : "2 ou mais quartos";
    var preco = selPreco ? selPreco.value : "";

    var msg =
      "Olá! Quero buscar imóveis na Teto Certo.\n" +
      "- Modalidade: " + modAtual + "\n" +
      "- Bairro: " + bairro + "\n" +
      "- Tipo: " + tipo + "\n" +
      "- Quartos: " + quartos + "\n" +
      "- Faixa de valor: " + preco;

    btnBuscar.setAttribute("href", montarUrlZap(zap, msg));

    // Destaca cartões compatíveis na vitrine sem esconder os demais
    var cards = document.querySelectorAll(".card-imovel");
    cards.forEach(function (card) {
      var cardMod = card.getAttribute("data-modalidade");
      var cardBairro = card.getAttribute("data-bairro");
      var bateMod = cardMod === modAtual;
      var bateBairro = bairro === "Qualquer bairro" || cardBairro === bairro;
      card.classList.toggle("card-destacado", bateMod && bateBairro && bairro !== "Qualquer bairro");
    });
  }

  abasMod.forEach(function (aba) {
    aba.addEventListener("click", function () {
      modAtual = aba.getAttribute("data-mod") || "Comprar";
      abasMod.forEach(function (b) {
        var ativa = b === aba;
        b.classList.toggle("ativa", ativa);
        b.setAttribute("aria-selected", ativa ? "true" : "false");
      });

      if (selPreco) {
        var opcoes = selPreco.querySelectorAll("option");
        var primeiraValida = null;
        opcoes.forEach(function (opt) {
          var compativel = opt.getAttribute("data-mod-opt") === modAtual;
          opt.hidden = !compativel;
          if (compativel && !primeiraValida) primeiraValida = opt.value;
        });
        if (primeiraValida) selPreco.value = primeiraValida;
      }
      atualizarBusca();
    });
  });

  [selBairro, selTipo, selQuartos, selPreco].forEach(function (el) {
    if (el) el.addEventListener("change", atualizarBusca);
  });

  // Tags rápidas preenchem os filtros e destacam os imóveis
  var tagsRapidas = document.querySelectorAll(".tag-rapida");
  tagsRapidas.forEach(function (tag) {
    tag.addEventListener("click", function () {
      var mod = tag.getAttribute("data-modalidade");
      var bairro = tag.getAttribute("data-bairro");
      var tipo = tag.getAttribute("data-tipo");
      if (mod) {
        abasMod.forEach(function (b) {
          if (b.getAttribute("data-mod") === mod) b.click();
        });
      }
      if (bairro && selBairro) selBairro.value = bairro;
      if (tipo && selTipo) selTipo.value = tipo;
      atualizarBusca();
    });
  });

  atualizarBusca();

  // 2. Vitrine de imóveis: ícone de favorito que liga/desliga
  var botoesFav = document.querySelectorAll(".btn-favorito");
  var painelFav = document.getElementById("painel-favoritos");
  var contadorFav = document.getElementById("contador-favoritos");
  var linkZapFav = document.getElementById("link-zap-favoritos");

  function atualizarFavoritos() {
    var selecionados = [];
    botoesFav.forEach(function (btn) {
      if (btn.getAttribute("aria-pressed") === "true") {
        selecionados.push(btn.getAttribute("data-codigo") + " (" + btn.getAttribute("data-resumo") + ")");
      }
    });

    if (!painelFav || !contadorFav || !linkZapFav) return;
    if (selecionados.length === 0) {
      painelFav.hidden = true;
    } else {
      painelFav.hidden = false;
      contadorFav.textContent =
        selecionados.length === 1 ? "1 imóvel salvo" : selecionados.length + " imóveis salvos";
      var zap = formBusca ? formBusca.getAttribute("data-zap") : "";
      var texto =
        "Olá! Salvei estes imóveis no site da Teto Certo e gostaria de receber mais detalhes:\n- " +
        selecionados.join("\n- ");
      linkZapFav.setAttribute("href", montarUrlZap(zap, texto));
    }
  }

  botoesFav.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ativo = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", ativo ? "false" : "true");
      atualizarFavoritos();
    });
  });

  // 3. Formulário curto para anunciar imóvel
  var formAnunciar = document.getElementById("form-anunciar");
  var btnAnunciar = document.getElementById("btn-anunciar-zap");
  if (formAnunciar && btnAnunciar) {
    var camposAnunciar = formAnunciar.querySelectorAll("select, input");
    function atualizarMsgAnunciar() {
      var zap = formAnunciar.getAttribute("data-zap");
      var obj = (document.getElementById("an-objetivo") || {}).value || "Colocar para vender";
      var tipo = (document.getElementById("an-tipo") || {}).value || "Apartamento";
      var quartos = (document.getElementById("an-quartos") || {}).value || "a informar";
      var bairro = (document.getElementById("an-bairro") || {}).value || "a informar";
      var msg =
        "Olá! Quero anunciar um imóvel com a Teto Certo.\n" +
        "- Objetivo: " + obj + "\n" +
        "- Tipo: " + tipo + "\n" +
        "- Tamanho/Quartos: " + (quartos.trim() || "a informar") + "\n" +
        "- Bairro: " + (bairro.trim() || "Belo Horizonte");
      btnAnunciar.setAttribute("href", montarUrlZap(zap, msg));
    }
    camposAnunciar.forEach(function (c) {
      c.addEventListener("input", atualizarMsgAnunciar);
      c.addEventListener("change", atualizarMsgAnunciar);
    });
    atualizarMsgAnunciar();
  }
})();
