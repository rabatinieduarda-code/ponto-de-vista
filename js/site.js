// Interações gerais do site Ponto de Vista
const themeButton = document.querySelector('#theme');
const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('#nav');
const currentPage = location.pathname.split('/').pop() || 'index.html';

// Mantém a preferência de tema entre visitas.
const savedTheme = localStorage.getItem('ponto-de-vista-theme');
if (savedTheme === 'dark') {
  document.documentElement.dataset.theme = 'dark';
}

function refreshThemeLabel() {
  if (!themeButton) return;
  themeButton.textContent = document.documentElement.dataset.theme === 'dark'
    ? 'Tema claro'
    : 'Tema escuro';
}
refreshThemeLabel();

themeButton?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  if (nextTheme === 'light') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = nextTheme;
  }
  localStorage.setItem('ponto-de-vista-theme', nextTheme);
  refreshThemeLabel();
});

// Menu compacto para telas menores.
menuButton?.addEventListener('click', () => {
  navigation?.classList.toggle('open');
  menuButton.textContent = navigation?.classList.contains('open') ? 'Fechar' : 'Menu';
});

// Destaca a página atual na navegação.
document.querySelectorAll('#nav a').forEach((link) => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Mantém apenas uma produção aberta por vez nas páginas de gêneros.
document.querySelectorAll('details.work').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('details.work[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// Formulário de contato demonstrativo: não envia dados a um servidor.
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#nome')?.value.trim();
  if (formNote) {
    formNote.textContent = `Obrigada, ${name}! Sua mensagem foi preenchida. Este formulário ainda não está conectado a uma caixa de e-mail.`;
  }
  contactForm.reset();
});

// Ano atualizado automaticamente no rodapé.
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});


// Busca por título ou autora nas páginas de Cordéis, Contos e Resenhas.
const searchInput = document.querySelector("#searchWorks");
const searchItems = document.querySelectorAll("details.work");
const emptyMessage = document.querySelector("#searchEmpty");

function normalizeSearch(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

searchInput?.addEventListener("input", () => {
  const query = normalizeSearch(searchInput.value.trim());
  let visibleCount = 0;
  searchItems.forEach((item) => {
    const searchableText = normalizeSearch(item.querySelector("summary")?.textContent || "");
    const matches = searchableText.includes(query);
    item.hidden = !matches;
    if (matches) visibleCount++;
  });
  if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
});
