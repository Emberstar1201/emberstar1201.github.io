<script setup>
import CustomCursor from "@/components/CustomCursor.vue";
import ScanLine from "@/components/ScanLine.vue";
import CursorEffect from "@/components/CursorEffect.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
</script>

<template>
  <CursorEffect />
  <CustomCursor/>
  <ScanLine />
  <router-view/>
  <MusicPlayer />
</template>

<style scoped>

</style>
