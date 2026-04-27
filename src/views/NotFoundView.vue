<template>
  <div class="not-found">
    <div class="not-found__content">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Página não encontrada</h1>
      <p class="not-found__text">O link que você acessou pode estar quebrado ou essa página não existe mais.</p>
      <RouterLink to="/feed" class="not-found__btn">Voltar para o Feed</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg);
}
.not-found__content {
  text-align: center;
  max-width: 400px;
}
.not-found__code {
  font-size: 80px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f09433, #dc2743, #bc1888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.not-found__title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}
.not-found__text {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
}
.not-found__btn {
  display: inline-block;
  padding: 11px 28px;
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(88, 81, 219, 0.35);
}
.not-found__btn:hover {
  box-shadow: 0 4px 16px rgba(88, 81, 219, 0.45);
  transform: translateY(-1px);
}
</style>
