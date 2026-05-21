<!-- 集享公社 Logo -->
<template>
  <div class="flex-cc">
    <img :style="logoStyle" :src="logoSrc" alt="集享公社" class="w-full h-full object-contain" />
  </div>
</template>

<script setup lang="ts">
  import logoImg from '@imgs/common/logo.png'

  defineOptions({ name: 'ArtLogo' })

  interface Props {
    size?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 36
  })

  const logoSrc = logoImg
  const logoStyle = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>
