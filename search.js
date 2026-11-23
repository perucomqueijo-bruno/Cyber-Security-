document.addEventListener("DOMContentLoaded", () => {
  const searchContainer = document.querySelector(".search");
  const searchInput = searchContainer.querySelector('input[type="search"]');
  const navLinks = document.querySelectorAll("nav.icons a");

  // Captura texto, link e ícone diretamente do seu <nav>
  const opcoes = Array.from(navLinks).map(link => {
    const img = link.querySelector("img");
    return {
      nome: link.textContent.trim(),
      href: link.getAttribute("href"),
      icone: img ? img.getAttribute("src") : null
    };
  });

  // Cria a lista suspensa dentro de .search
  const listaSugestoes = document.createElement("ul");
  listaSugestoes.className = "search-suggestions";
  searchContainer.appendChild(listaSugestoes);

  let indiceSelecionado = -1;

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function navegarPara(href, nome) {
    searchInput.value = nome;
    listaSugestoes.style.display = "none";
    indiceSelecionado = -1;
    window.location.hash = href;
  }

  function atualizarDestaque(itens) {
    itens.forEach((li, index) => {
      li.classList.toggle("ativo", index === indiceSelecionado);
    });
  }

  function atualizarSugestoes(termo = "") {
    listaSugestoes.innerHTML = "";
    indiceSelecionado = -1;
    const busca = normalizar(termo);

    const resultados = opcoes.filter(item =>
      normalizar(item.nome).includes(busca)
    );

    if (resultados.length === 0) {
      listaSugestoes.style.display = "none";
      return;
    }

    resultados.forEach(item => {
      const li = document.createElement("li");

      if (item.icone) {
        const img = document.createElement("img");
        img.src = item.icone;
        img.alt = "";
        li.appendChild(img);
      }

      const span = document.createElement("span");
      span.textContent = item.nome;
      li.appendChild(span);

      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        navegarPara(item.href, item.nome);
      });

      listaSugestoes.appendChild(li);
    });

    listaSugestoes.style.display = "block";
  }

  // Abre ao clicar na barra
  searchInput.addEventListener("focus", () => {
    atualizarSugestoes(searchInput.value);
  });

  // Filtra ao digitar
  searchInput.addEventListener("input", () => {
    atualizarSugestoes(searchInput.value);
  });

  // Suporte às setas do teclado e Enter
  searchInput.addEventListener("keydown", (e) => {
    const itens = listaSugestoes.querySelectorAll("li");
    if (!itens.length || listaSugestoes.style.display === "none") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      indiceSelecionado = (indiceSelecionado + 1) % itens.length;
      atualizarDestaque(itens);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      indiceSelecionado = (indiceSelecionado - 1 + itens.length) % itens.length;
      atualizarDestaque(itens);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const alvo = indiceSelecionado >= 0 ? itens[indiceSelecionado] : itens[0];
      if (alvo) alvo.dispatchEvent(new Event("mousedown"));
    } else if (e.key === "Escape") {
      listaSugestoes.style.display = "none";
    }
  });

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      listaSugestoes.style.display = "none";
    }
  });
});
