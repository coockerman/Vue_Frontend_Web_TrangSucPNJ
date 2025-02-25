<template>
  <div class="user-home">
    <Navbar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/HomeUser/NavbarForm.vue'

export default {
  components: {
    Navbar,
  },
}
</script>
