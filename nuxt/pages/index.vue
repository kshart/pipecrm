<template>
  <div>
    <QBtn to="/login">
      login
    </QBtn>
    <QBtn @click="signOut()">
      signOut
    </QBtn>
    {{ sss }}
    <NuxtWelcome />
  </div>
</template>

<script lang="ts" setup>
const { signOut, getSession } = useAuth()

const sss = await getSession()
</script>
