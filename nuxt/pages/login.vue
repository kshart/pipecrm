<template>
  <div>
    <v-btn @click="login()">
      test
    </v-btn>
    <pre>{{ data }}</pre>

    <v-btn @click="signOut()">
      signOut
    </v-btn>
    <pre>{{ providers }}</pre>

    <v-btn
      v-for="provider of providers"
      :key="provider.id"
      @click="signIn(provider.id)"
    >
      Sign in with {{ provider.name }}
    </v-btn>
    <v-btn @click="signIn('password', demoCredentials)">
      Username and Password
    </v-btn>
    {{ sss }}
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

const { signIn, signOut, getSession, getProviders } = useAuth()

const providers = await getProviders()

const demoCredentials = {
  redirect: false,
  username: 'kshart@yandex.ru',
  password: '322',
}

const data = ref<unknown | null>(null)

const login = async () => {
  data.value = await useFetch('/api/auth')
}
const sss = await getSession()
</script>
