<script lang="ts" setup>
const route = useRoute()
const { username, password } = route.query
const { signIn } = useAuth()

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

signIn('credentials', {
  username,
  password,
})
</script>

<template>
  <div>
  </div>
</template>
