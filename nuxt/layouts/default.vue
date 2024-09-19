<template>
  <v-app>
    <v-navigation-drawer
      rail
      expand-on-hover
    >
      <v-list-item
        v-if="user"
        :title="user.name || ''"
        :prepend-avatar="user.image || ''"
      />
      <v-divider />
      <v-list-item
        to="/"
        link
        title="Dashboard"
      />
      <v-list-item
        to="/tasks"
        link
        title="Tasks"
      />
      <v-list-item
        to="/dialogs"
        link
        title="Dialogs"
      />
      <template #append>
        <v-list-item
          title="signOut"
          @click="signOut()"
        />
      </template>
    </v-navigation-drawer>
    <NuxtPage />
  </v-app>
</template>

<script lang="ts" setup>
const { signOut, getSession } = useAuth()

const { user } = await getSession()
</script>
