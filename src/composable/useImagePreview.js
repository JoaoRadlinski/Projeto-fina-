import { ref, onUnmounted } from 'vue'

export function useImagePreview() {
  const file       = ref(null)
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
    if (newFile) previewUrl.value = URL.createObjectURL(newFile)
  }

  function clear() {
    revoke()
    file.value = null
  }

  onUnmounted(revoke)

  return { file, previewUrl, setFile, clear }
}
