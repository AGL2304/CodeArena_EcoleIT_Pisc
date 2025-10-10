<template>
  <nav class="bg-gray-100 border-b border-gray-300 shadow-sm">
    <div class="container mx-auto px-6 py-3 flex flex-wrap items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Gestion des utilisateurs</h2>

      <div class="flex gap-4">
        <router-link
          to="/admin/users"
          class="text-gray-700 hover:text-blue-600 transition"
          :class="{ 'font-bold text-blue-700 border-b-2 border-blue-700 pb-1': $route.path === '/admin/users' }"
        >
          Liste des utilisateurs
        </router-link>

        <router-link
          to="/admin/users/create"
          class="text-gray-700 hover:text-blue-600 transition"
          :class="{ 'font-bold text-blue-700 border-b-2 border-blue-700 pb-1': $route.path === '/admin/users/create' }"
        >
          Ajouter un utilisateur
        </router-link>

        <router-link
          to="/admin/users/roles"
          class="text-gray-700 hover:text-blue-600 transition"
          :class="{ 'font-bold text-blue-700 border-b-2 border-blue-700 pb-1': $route.path === '/admin/users/roles' }"
        >
          Rôles & Permissions
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AdminUserSubBar",
};
</script>

<style scoped>
nav {
  z-index: 10;
}
</style>
