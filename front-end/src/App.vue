<!-- App.vue -->
<script setup>
import { useLoading } from "./composables/useLoading";
import { watch } from "vue";
import Navbar from "./components/Navbar.vue";

const { isLoading } = useLoading();

// Remove o loader inicial do HTML quando o app está pronto
watch(
  isLoading,
  (loading) => {
    if (loading === false) {
      const loader = document.getElementById("app-loading");
      if (loader) {
        loader.style.transition = "opacity 0.5s ease";
        loader.style.opacity = "0";
        loader.addEventListener("transitionend", () => loader.remove());
      }
    }
  },
  { once: true },
);
</script>

<template>
  <div>
    <Navbar></Navbar>
    <div class="main-content-area">
      <!-- ESTE É O SPINNER QUE APARECE DURANTE A NAVEGAÇÃO -->
      <div v-if="isLoading" class="loading-overlay-router">
        <div class="spinner"></div>
      </div>

      <!-- O conteúdo da rota só é visível quando o loading termina -->
      <router-view v-show="!isLoading"></router-view>
    </div>
  </div>
</template>

<style>
/* Contêiner principal do conteúdo */
.main-content-area {
  position: relative;
  min-height: calc(100vh - 70px); /* Ajuste 70px para a altura da sua navbar */
}

/* Overlay de loading para as rotas */
.loading-overlay-router {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 20, 20, 0.7); /* Um pouco mais transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

/* Estilos do spinner (você pode mover do index.html para cá se quiser,
   ou deixar nos dois lugares, não tem problema) */
.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid #f3f3f3;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
