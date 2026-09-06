<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close-modal')"></div>
    <div class="modal-card" style="width: 800px; max-width: 95vw">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ skill.skill_id ? "Editar Skill" : "Nova Skill" }}
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="$emit('close-modal')"
        ></button>
      </header>

      <section class="modal-card-body">
        <div class="columns">
          <div class="column is-2">
            <label class="label">ID (Game)</label>
            <input
              class="input"
              type="number"
              v-model="skill.skill_id"
              placeholder="Ex: 1029"
            />
          </div>
          <div class="column is-4">
            <label class="label">Nome da Skill</label>
            <input
              class="input"
              type="text"
              v-model="skill.name"
              placeholder="Ex: Solar Flare"
            />
          </div>
          <div class="column is-3">
            <label class="label">Classe</label>
            <div class="select is-fullwidth">
              <select v-model="skill.class">
                <option value="Warrior">Warrior</option>
                <option value="Sorceress">Sorceress</option>
              </select>
            </div>
          </div>
          <div class="column is-3">
            <label class="label">Cooldown (s)</label>
            <input class="input" type="number" v-model="skill.cooldown" />
          </div>
        </div>

        <hr />

        <div class="level">
          <div class="level-left">
            <h3 class="title is-5 m-0">Lista de Hits</h3>
          </div>
          <div class="level-right">
            <button class="button is-small is-info" @click="addHit">
              + Adicionar Hit
            </button>
          </div>
        </div>

        <div class="hits-container">
          <div
            v-for="(hit, index) in skill.hits"
            :key="index"
            class="box has-background-light is-relative"
          >
            <button
              class="delete is-small"
              style="position: absolute; top: 10px; right: 10px"
              @click="removeHit(index)"
            ></button>

            <div class="columns is-multiline is-mobile">
              <div class="column is-12">
                <label class="label is-small">Descrição</label>
                <input
                  class="input is-small"
                  type="text"
                  v-model="hit.description"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-success" @click="save">Salvar</button>
        <button class="button" @click="$emit('close-modal')">Cancelar</button>
      </footer>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";

export default {
  name: "SkillFormModal",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "close-modal", "save-skill"],
  setup(props, { emit }) {
    const skill = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const addHit = () => {
      if (!skill.value.hits) {
        skill.value.hits = [];
      }

      const emptyHit = {
        hit_number: skill.value.hits.length + 1,
        skill_id: skill.value.id,
        description: "Golpe Padrão",
        damage_percent: 0,
        hit_count: 1,
        cc_effect: "null",
        is_down_attack: false,
        is_air_attack: false,
        crit_rate: 0,
        pvp_reduction: 0,
        is_down_smash: false,
      };

      skill.value.hits.push(emptyHit);
    };

    const removeHit = (index) => {
      skill.value.hits.splice(index, 1);
    };

    const save = () => {
      emit("save-skill", skill.value);
    };

    return {
      skill,
      addHit,
      removeHit,
      save,
    };
  },
};
</script>
<style></style>
