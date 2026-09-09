<template>
  <div>
    <div>
      Última atualização:
      {{
        !data
          ? "Carregando ..."
          : new Date(data?.updated_at).toLocaleString("pt-br")
      }}
    </div>
    <div>
      <h2>
        <strong>Banco de Dados</strong>
      </h2>
      <p>
        Versão do Postgres:
        {{ !data ? "Carregando ..." : data?.dependencies?.database?.version }}
      </p>
      <p>
        Conexões disponíveis:
        {{
          !data
            ? "Carregando ..."
            : data?.dependencies?.database?.max_connections
        }}
      </p>
      <p>
        Conexões abertas:
        {{
          !data
            ? "Carregando ..."
            : data?.dependencies?.database?.opened_connections
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { data, refresh } = await useFetch("/api/v1/status");

let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    refresh();
  }, 2000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
