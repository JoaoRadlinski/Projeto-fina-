<template>
  <div class="pagina">
    <div class="conteudo">
      <p class="codigo">404</p>
      <h1 class="titulo">Pagina nao encontrada</h1>
      <p class="descricao">O link que voce acessou pode estar quebrado ou essa pagina nao existe mais.</p>
      <RouterLink to="/feed" class="botao">Voltar para o Feed</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg);
}

.conteudo {
  text-align: center;
  max-width: 400px;
}

.codigo {
  font-size: 80px;
  font-weight: 700;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
}

.titulo {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}

.descricao {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
}

.botao {
  display: inline-block;
  padding: 11px 28px;
  background: var(--blue);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.botao:hover {
  background: var(--blue-dark);
}
</style>
