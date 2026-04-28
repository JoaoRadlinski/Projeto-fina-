<template>
  <!-- Imita a estrutura visual do PostCard com animação shimmer -->
  <article class="post-skeleton">

    <!-- Header -->
    <div class="post-skeleton__header">
      <div class="skel skel--circle skel--avatar"></div>
      <div class="post-skeleton__header-text">
        <div class="skel skel--line" style="width: 120px; height: 12px;"></div>
        <div class="skel skel--line" style="width: 80px; height: 10px; margin-top: 5px;"></div>
      </div>
    </div>

    <!-- Imagem -->
    <div class="skel post-skeleton__image"></div>

    <!-- Body -->
    <div class="post-skeleton__body">
      <!-- Ícones de ação -->
      <div class="post-skeleton__actions">
        <div class="skel skel--circle" style="width: 28px; height: 28px;"></div>
        <div class="skel skel--circle" style="width: 28px; height: 28px;"></div>
        <div class="skel skel--circle" style="width: 28px; height: 28px;"></div>
      </div>
      <!-- Curtidas -->
      <div class="skel skel--line" style="width: 80px; height: 12px;"></div>
      <!-- Legenda linha 1 -->
      <div class="skel skel--line" style="width: 100%; height: 11px; margin-top: 8px;"></div>
      <!-- Legenda linha 2 -->
      <div class="skel skel--line" style="width: 70%; height: 11px; margin-top: 5px;"></div>
    </div>

  </article>
</template>

<style scoped>
/* ── Card base ─────────────────────────────────────────────────────────── */
.post-skeleton {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 12px;
}

/* ── Header ─────────────────────────────────────────────────────────────  */
.post-skeleton__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.post-skeleton__header-text {
  display: flex;
  flex-direction: column;
}

/* ── Imagem ──────────────────────────────────────────────────────────── */
.post-skeleton__image {
  width: 100%;
  aspect-ratio: 1 / 1;
}

/* ── Body ────────────────────────────────────────────────────────────── */
.post-skeleton__body {
  padding: 10px 12px 14px;
}

.post-skeleton__actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

/* ── Blocos genéricos skeleton ───────────────────────────────────────── */
.skel {
  background: linear-gradient(
    90deg,
    var(--color-surface-alt) 25%,
    var(--color-border) 50%,
    var(--color-surface-alt) 75%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 1.6s ease-in-out infinite;
  border-radius: 6px;
}

.skel--circle  { border-radius: 50%; }
.skel--avatar  { width: 38px; height: 38px; flex-shrink: 0; }
.skel--line    { display: block; }

@keyframes shimmer-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
