<template>
  <div class="card">
    <!-- Logo -->
    <h1 class="logo">Lumeo</h1>
    <p class="slogan">Crie sua conta e compartilhe momentos.</p>

    <!-- Formulário -->
    <form @submit.prevent="cadastrar">
      <div class="campo">
        <label for="nome">Nome completo</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          placeholder="Como você quer ser chamado"
          autocomplete="name"
          :disabled="carregando"
          required
        />
      </div>

      <div class="campo">
        <label for="usuario">Nome de usuário</label>
        <input
          id="usuario"
          v-model="usuario"
          type="text"
          placeholder="ex: joao.silva"
          autocomplete="username"
          :disabled="carregando"
          required
        />
      </div>

      <div class="campo">
        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          autocomplete="email"
          :disabled="carregando"
          required
        />
      </div>

      <div class="campo">
        <label for="senha">Senha</label>
        <input
          id="senha"
          v-model="senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autocomplete="new-password"
          :disabled="carregando"
          required
        />
      </div>

      <p v-if="erro" class="mensagem-erro">{{ erro }}</p>

      <button type="submit" class="botao-cadastrar" :disabled="carregando">
        {{ carregando ? 'Criando conta...' : 'Criar conta' }}
      </button>
    </form>

    <p class="termos">
      Ao se cadastrar, você concorda com nossos termos de uso.
    </p>

    <!-- Rodapé -->
    <p class="rodape">
      Já tem uma conta?
      <RouterLink to="/login">Entrar</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { extractErrorMessage } from '@/services/api.js'
import { ROUTE_NAMES } from '@/router/routeNames.js'

const router = useRouter()
const auth = useAuthStore()

const nome = ref('')
const usuario = ref('')
const email = ref('')
const senha = ref('')
const carregando = ref(false)
const erro = ref('')

async function cadastrar() {
  erro.value = ''
  carregando.value = true
  try {
    await auth.register({
      name: nome.value,
      username: usuario.value,
      email: email.value,
      password: senha.value,
    })
    router.push({ name: ROUTE_NAMES.FEED })
  } catch (err) {
    erro.value = extractErrorMessage(err, 'Nao foi possivel criar a conta. Tente novamente.')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.card {
  width: 100%;
  padding: 36px 32px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.logo {
  font-size: 36px;
  font-family: 'Billabong', 'Grand Hotel', cursive;
  text-align: center;
  margin-bottom: 6px;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slogan {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.4;
}

.campo {
  margin-bottom: 12px;
}

.campo label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 5px;
}

.campo input {
  width: 100%;
  padding: 10px 12px;
  background: var(--surface-alt);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.campo input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(0, 149, 246, 0.12);
  background: white;
}

.mensagem-erro {
  font-size: 13px;
  color: var(--red);
  text-align: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #fff0f0;
  border-radius: 8px;
}

.botao-cadastrar {
  width: 100%;
  padding: 11px 0;
  background: var(--blue);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;
  margin-top: 4px;
}

.botao-cadastrar:hover:not(:disabled) {
  background: var(--blue-dark);
}

.botao-cadastrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.termos {
  margin-top: 14px;
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
}

.rodape {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  text-align: center;
  color: var(--text-muted);
}

.rodape a {
  color: var(--blue);
  font-weight: 600;
  text-decoration: none;
}

.rodape a:hover {
  text-decoration: underline;
}
</style>
