<template>
  <nav
    class="navbar custom-navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item logo-item has-text-weight-bold">
        <img
          src="../assets/logo.jpg"
          alt="logoBdoOptimizer"
          style="margin-right: 10px"
        />
        BDO OPTIMIZER
      </router-link>
      <a href="https://discord.gg/kNYvABEHJ3">
        <img
          src="../assets/discord.png"
          class="image is-24x24 mt-4"
          alt="Discord Logo"
          style="margin-left: 10px"
        />
      </a>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        :class="{ 'is-active': isMenuOpen }"
        @click="toggleMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navMenu" class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <div class="navbar-start">
        <!-- Enhancing Dropdown -->
        <div
          class="navbar-item has-dropdown"
          :class="{ 'is-active': activeDropdown === 'enhancing' }"
          @mouseover="activeDropdown = 'enhancing'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">Enhancing</a>
          <div class="navbar-dropdown">
            <router-link
              to="/enhancing-simulator"
              class="navbar-item"
              active-class="is-active"
              @click="activeDropdown = null"
            >
              Enhancing Simulator
            </router-link>
          </div>
        </div>

        <!-- PVP Dropdown -->
        <div
          class="navbar-item has-dropdown"
          :class="{ 'is-active': activeDropdown === 'pvp' }"
          @mouseover="activeDropdown = 'pvp'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">PVP</a>
          <div class="navbar-dropdown">
            <router-link
              to="/combo-builder"
              class="navbar-item"
              active-class="is-active"
              @click="activeDropdown = null"
            >
              Combo Builder
            </router-link>
            <router-link
              to="/pvp-calculator"
              class="navbar-item"
              active-class="is-active"
              @click="activeDropdown = null"
            >
              PvP Calculator
            </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <!-- Botão de Login Discord -->
        <div v-if="!authStore.isLoggedIn" class="navbar-item">
          <a :href="`${backEndUrl}/auth/discord`" class="discord-login-button">
            <img
              src="../assets/discord.png"
              alt="Discord Login"
              class="discord-icon"
            />
            <span>Login</span>
          </a>
        </div>

        <!-- Dropdown do Usuário (quando logado) -->
        <div v-else class="navbar-item has-dropdown is-hoverable user-dropdown">
          <a class="navbar-link user-avatar-link">
            <figure class="image is-32x32 mt-1">
              <img
                :src="authStore.user?.avatarUrl"
                alt="User Avatar"
                class="is-rounded"
              />
            </figure>
          </a>
          <div class="navbar-dropdown is-right">
            <div class="navbar-item dropdown-username">
              <strong>{{ authStore.user.username }}</strong>
            </div>
            <div class="buttons">
              <a
                class="button is-small is-danger"
                style="color: white"
                @click="logout"
                >Logout</a
              >
            </div>
          </div>
        </div>

        <!-- Region Dropdown -->
        <div
          class="navbar-item has-dropdown"
          :class="{ 'is-active': activeDropdown === 'region' }"
          @mouseover="activeDropdown = 'region'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">{{ regionStore.selectedRegion.label }}</a>
          <div class="navbar-dropdown is-right">
            <a
              v-for="region in regions"
              :key="region.value"
              class="navbar-item"
              :class="{
                'is-active': regionStore.selectedRegion.value === region.value,
              }"
              @click="selectRegion(region)"
            >
              {{ region.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRegionStore } from "../stores/regionStore";
import { useAuthStore } from "../stores/authStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "NavbarComponent",
  setup() {
    const router = useRouter();
    const regionStore = useRegionStore();
    const authStore = useAuthStore();
    const isMenuOpen = ref(false);
    const activeDropdown = ref(null); // Controla qual dropdown está ativo
    const backEndUrl = `http://${process.env.VUE_APP_BACK_END_URL}`;

    const regions = ref([
      { value: "na", label: "NA" },
      { value: "eu", label: "EU" },
      { value: "sea", label: "SEA" },
      { value: "mena", label: "MENA" },
      { value: "kr", label: "KR" },
      { value: "ru", label: "RU" },
      { value: "jp", label: "JP" },
      { value: "th", label: "TH" },
      { value: "tw", label: "TW" },
      { value: "sa", label: "SA" },
    ]);

    function toggleMenu() {
      isMenuOpen.value = !isMenuOpen.value;
    }

    function selectRegion(regionObject) {
      regionStore.setRegion(regionObject);
      activeDropdown.value = null; // Fecha o dropdown após a seleção
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
      }
    }
    async function logout() {
      await authStore.logout();
      router.go(0);
    }
    return {
      regionStore,
      isMenuOpen,
      regions,
      toggleMenu,
      selectRegion,
      activeDropdown,
      backEndUrl,
      authStore,
      logout,
    };
  },
};
</script>

<style>
@import "bulma/css/bulma.min.css";

.custom-navbar .navbar-item:hover,
.custom-navbar .navbar-link:hover {
  color: #ffffff;
}

/* --- Layout e Centralização --- */
.navbar-menu {
  flex-grow: 1;
}

.navbar-start {
  margin: 0 auto;
}

/* --- Estilo da Seta do Dropdown --- */
.navbar-link::after {
  border-color: #8a93f0;
  border-width: 0 1.5px 1.5px 0;
  height: 6px;
  width: 6px;
  margin-top: -4px;
  transition: border-color 0.2s ease;
}

.navbar-link:hover::after {
  border-color: #ffffff;
}

/* --- Estilo do Dropdown --- */
.navbar-dropdown {
  background-color: #222;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.25rem 0;
}

.navbar-dropdown .navbar-item {
  font-size: 0.85rem;
  color: #ccc;
}

.navbar-dropdown .navbar-item:hover,
.navbar-dropdown .navbar-item.is-active {
  background-color: #333 !important;
  color: #fff !important;
}

/* --- Botão de Login Discord --- */
.discord-login-button {
  background-color: #282b30;
  border: 1px solid #42464d;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.discord-login-button:hover {
  background-color: #393d42;
  color: #ffffff;
}

.discord-login-button .discord-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.logo-item {
  color: #e0e2e4 !important;
}

.navbar-burger {
  color: #eaeaea;
}

/* --- MUDANÇA PRINCIPAL AQUI --- */
.user-avatar-link,
.user-avatar-link:hover {
  /* Remove o padding para a hitbox ficar do tamanho do ícone */
  padding: 0 !important;
}

.user-avatar-link::after {
  display: none !important;
}

/* Controla o espaçamento do container do avatar */
.navbar-end .user-dropdown.navbar-item {
  /* Mantém o padding vertical e reduz o horizontal para aproximar os itens */
  padding: 0.5rem 0.25rem;
}

.dropdown-username {
  font-size: 0.9rem;
  color: #ccc;
}

.dropdown-username strong {
  color: #fff;
}

/* --- Responsividade Mobile --- */
@media screen and (max-width: 1023px) {
  .navbar-menu.is-active {
    background-color: #1a1a1a;
  }

  .navbar-start {
    margin: 0;
  }

  .navbar-dropdown {
    background-color: transparent;
    border: none !important;
    text-align: center;
  }
}
</style>
