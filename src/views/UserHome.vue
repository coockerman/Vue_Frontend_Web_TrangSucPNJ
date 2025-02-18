<template>
  <div class="container">
    <Navbar />
    <BodyHomeUser />
  </div>
</template>

<script>
import Navbar from '@/components/HomeUser/NavbarForm.vue'
import BodyHomeUser from '@/components/HomeUser/BodyHomeUser.vue'
export default {
  components: {
    Navbar,
    BodyHomeUser,
  },
}
</script>
