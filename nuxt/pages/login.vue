<template>
  <div>
    <QBtn @click="login()">
      test
    </QBtn>
    <pre>{{ data }}</pre>

    <QBtn @click="signOut()">
      signOut
    </QBtn>
    <pre>{{ providers }}</pre>

    <QBtn
      v-for="provider of providers"
      :key="provider.id"
      @click="signIn(provider.id)"
    >
      Sign in with {{ provider.name }}
    </QBtn>
    <QBtn @click="signIn('credentials', demoCredentials)">
      Username and Password
    </QBtn>
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

/*
 * NOTE: Here we hard-coded username and password
 * On your own page this should probably be connected to two inputs
 */
const demoCredentials = {
  username: 'k.artem@metrika72.ru',
  password: 'tm9xbL6CFynA-r33',
}

const data = ref<unknown | null>(null)

const login = async () => {
  data.value = await useFetch('/api/auth')
}
const sss = await getSession()
</script>
