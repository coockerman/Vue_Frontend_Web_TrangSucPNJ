<template>
  <div class="user-home">
    <Navbar />
    <div class="content">
      <router-view />
    </div>
    <Chat />
  </div>
</template>

<script>
import Navbar from '@/components/HomeUser/NavbarForm.vue'
import Chat from '@/components/HomeUser/ChatForm.vue'

export default {
  components: {
    Navbar,
    Chat,
  },
}
</script>
