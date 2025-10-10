<template>
  <div>
    <AdminNavBar />

    <!-- Nouvelle barre de gestion utilisateurs -->
    <AdminUserSubBar />

    <!-- Contenu existant -->
    <div class="p-6">
      <!-- ton contenu utilisateur ici -->
    </div>
  </div>
</template>

<script>
import AdminNavBar from "@/components/admin/AdminNavBar.vue";
import AdminUserSubBar from "@/components/admin/AdminUserSubBar.vue";

export default {
  name: "AdminUsersView",
  components: {
    AdminNavBar,
    AdminUserSubBar,
  },
};
</script>
