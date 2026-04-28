import { ref, onUnmounted } from 'vue'

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANHO_MAX_MB = 5
const TAMANHO_MAX_BYTES = TAMANHO_MAX_MB * 1024 * 1024

export function useImageUpload() {
  const arquivo = ref(null)
  const previewUrl = ref('')
  const erro = ref('')

  function revogarPreview() {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
  }

  function selecionar(file) {
    erro.value = ''

    if (!file) return

    if (!TIPOS_ACEITOS.includes(file.type)) {
      erro.value = 'Formato inválido. Use JPG, PNG ou WebP.'
      return
    }

    if (file.size > TAMANHO_MAX_BYTES) {
      erro.value = `A imagem deve ter no máximo ${TAMANHO_MAX_MB} MB.`
      return
    }

    revogarPreview()
    arquivo.value = file
    previewUrl.value = URL.createObjectURL(file)
  }

  function aoSelecionarArquivo(evento) {
    selecionar(evento.target.files?.[0])
  }

  function aoSoltar(evento) {
    selecionar(evento.dataTransfer.files?.[0])
  }

  function limpar() {
    revogarPreview()
    arquivo.value = null
    erro.value = ''
  }

  onUnmounted(revogarPreview)

  return {
    arquivo,
    previewUrl,
    erro,
    aoSelecionarArquivo,
    aoSoltar,
    limpar,
  }
}
