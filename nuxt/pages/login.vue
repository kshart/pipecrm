<template>
  <div>
    <pre>{{ providers }}</pre>

    <v-btn
      v-for="provider of providers"
      :key="provider.id"
      @click="signIn(provider.id)"
    >
      Sign in with {{ provider.name }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})
const { signIn, getProviders } = useAuth()

const providers = await getProviders()
</script>
