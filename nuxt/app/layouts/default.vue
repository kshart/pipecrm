<script lang="ts" setup>
const theme = useTheme()
const { signOut, getSession, status } = useAuth()

const { user } = await getSession() || {}
</script>

<template>
  <v-app>
    <v-navigation-drawer
      rail
      :mobile="false"
      style="
        width: 56px;
      "
    >
      <v-list-item
        v-if="user"
        :title="user.name || ''"
        :prependAvatar="user.image || ''"
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
        {{ status }}

        <v-btn
          icon="mdi-theme-light-dark"
          @click="theme.cycle(['dark', 'light', 'system'])"
        />
        <v-list-item
          title="signOut"
          @click="signOut()"
        />
      </template>
    </v-navigation-drawer>
    <NuxtPage
      style="
        --v-layout-left: 56px;
        --v-layout-right: 0px;
        --v-layout-top: 0px;
        --v-layout-bottom: 0px;
      "
    />
  </v-app>
</template>

<style lang="scss">
@use "~/assets/scss/scroll.scss";

:root {
  overflow-y: auto;
}
</style>
