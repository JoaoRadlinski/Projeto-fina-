import { ref, onUnmounted, watch } from 'vue'

/**
 * Composable para preview local de imagens.
 * Cria URL.createObjectURL e revoga automaticamente ao trocar ou desmontar.
 *
 * Uso:
 *   const { file, previewUrl, setFile, clear } = useImagePreview()
 */
export function useImagePreview() {
  const file = ref(null)
  const previewUrl = ref(null)

  function revoke() {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }

  function setFile(newFile) {
    revoke()
    file.value = newFile
    if (newFile) {
      previewUrl.value = URL.createObjectURL(newFile)
    }
  }

  function clear() {
    revoke()
    file.value = null
  }

  onUnmounted(revoke)

  return { file, previewUrl, setFile, clear }
}
