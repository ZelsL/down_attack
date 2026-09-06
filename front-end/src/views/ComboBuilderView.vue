<template>
  <div class="container mt-6">
    <table class="table is-bordered mb-4" id="skills-table">
      <thead>
        <tr>
          <th>
            <span class="th-inline">
              <span>Icon</span>
            </span>
          </th>
          <th @click="changeIcon('sortName')" class="th-clickable">
            <span>Skill Name</span>
            <img :src="iconList.iconName" class="sort-icon" alt="Sort Icon" />
          </th>
          <th @click="changeIcon('sortDPS')" class="th-clickable">
            <span>DPS</span>
            <img :src="iconList.iconDPS" class="sort-icon" alt="Sort Icon" />
          </th>
          <th @click="changeIcon('sortTotalDamage')" class="th-clickable">
            <span>Total Damage</span>
            <img
              :src="iconList.iconTotalDamage"
              class="sort-icon"
              alt="Sort Icon"
            />
          </th>
          <th @click="changeIcon('sortCooldown')" class="th-clickable">
            <span>Cooldown</span>
            <img
              :src="iconList.iconCooldown"
              class="sort-icon"
              alt="Sort Icon"
            />
          </th>
          <th @click="changeIcon('sortAnimation')" class="th-clickable">
            <span>Animation</span>
            <img
              :src="iconList.iconAnimation"
              class="sort-icon"
              alt="Sort Icon"
            />
          </th>
          <th @click="changeIcon('sortCritHate')" class="th-clickable">
            <span>Crit Hate</span>
            <img
              :src="iconList.iconCritHate"
              class="sort-icon"
              alt="Sort Icon"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="skill in copySkills" :key="skill.id">
          <td>
            <a :href="'https://bdolytics.com/en/NA/db/skill/' + skill.gameId"
              ><img :src="skill.icon" alt="Skill Icon"
            /></a>
          </td>
          <td>{{ skill.name }}</td>
          <td>{{ (skill.totalDamage / skill.animation).toFixed(2) }} %</td>
          <td>{{ skill.totalDamage }} %</td>
          <td>{{ skill.cooldown }}s</td>
          <td>{{ skill.animation }}s</td>
          <td>{{ (skill.crit_hate * 100).toFixed(0) }} %</td>
        </tr>
      </tbody>
    </table>
    <!--<h1>{{ comboMaker() }}</h1>-->
  </div>
</template>

<script>
import { ref, computed } from "vue";
import skills from "@/data/classSkills/tamerSkills.json";

export default {
  name: "comboBuilderView",
  setup() {
    const copySkills = ref(skills);

    //Objeto para controle de ordenação
    let filterList = ref({
      sortName: false,
      sortDPS: false,
      sortTotalDamage: false,
      sortCooldown: false,
      sortAnimation: false,
      sortCritHate: false,
    });

    //Lista de ícones para ordenação
    const iconList = computed(() => {
      return {
        iconName: filterList.value.sortName
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
        iconDPS: filterList.value.sortDPS
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
        iconTotalDamage: filterList.value.sortTotalDamage
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
        iconCooldown: filterList.value.sortCooldown
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
        iconAnimation: filterList.value.sortAnimation
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
        iconCritHate: filterList.value.sortCritHate
          ? require("/public/icons/sorted_down.png")
          : require("/public/icons/sorted_up.png"),
      };
    });

    const sortSkills = (type = "Default") => {
      let sortedSkills = [...skills];
      switch (type) {
        case "sortName":
          sortedSkills.sort((a, b) =>
            filterList.value.sortName
              ? b.name.localeCompare(a.name)
              : a.name.localeCompare(b.name),
          );
          break;
        case "sortDPS":
          sortedSkills.sort((a, b) =>
            filterList.value.sortDPS
              ? b.totalDamage / b.animation - a.totalDamage / a.animation
              : a.totalDamage / a.animation - b.totalDamage / b.animation,
          );
          break;
        case "sortTotalDamage":
          sortedSkills.sort((a, b) =>
            filterList.value.sortTotalDamage
              ? b.totalDamage - a.totalDamage
              : a.totalDamage - b.totalDamage,
          );
          break;
        case "sortCooldown":
          sortedSkills.sort((a, b) =>
            filterList.value.sortCooldown
              ? b.cooldown - a.cooldown
              : a.cooldown - b.cooldown,
          );
          break;
        case "sortAnimation":
          sortedSkills.sort((a, b) =>
            filterList.value.sortAnimation
              ? b.animation - a.animation
              : a.animation - b.animation,
          );
          break;
        case "sortCritHate":
          sortedSkills.sort((a, b) =>
            filterList.value.sortCritHate
              ? b.crit_hate - a.crit_hate
              : a.crit_hate - b.crit_hate,
          );
          break;
        default:
          sortedSkills = [...skills];
      }
      copySkills.value = sortedSkills;
    };

    const comboMaker = (skillsPriority = [], addCritHate = 0, time = 10) => {
      let combo = [];
      let totalTime = 0;
      let totalDamage = 0;
      let cooldownSkills = [];

      async function updateCooldown(time, skill) {
        cooldownSkills.push({ id: skill, avaliableIn: totalTime + time });
      }
      for (let skill in skillsPriority) {
        combo.push(skillsPriority[skill]);
        let crit_hate =
          skills.find((id) => id.id === skillsPriority[skill]).crit_hate +
          addCritHate;
        if (crit_hate > 1) crit_hate = 1;
        totalDamage +=
          skills.find((id) => id.id === skillsPriority[skill]).totalDamage *
          ((1 + crit_hate) * 2);
        totalTime += skills.find(
          (id) => id.id === skillsPriority[skill],
        ).animation;
        combo.push(skillsPriority[skill]);
        updateCooldown(
          skills.find((id) => id.id === skillsPriority[skill]).cooldown,
          skillsPriority[skill],
        );
        if (totalTime >= time) return { combo, totalDamage, totalTime };
      }
      let bestDpsOrder = [];
      for (let skill in skills) {
        let dps =
          (skills[skill].totalDamage / skills[skill].animation) *
          (1 +
            (addCritHate + skills[skill].crit_hate >= 1
              ? 1
              : addCritHate + skills[skill].crit_hate));
        bestDpsOrder.push({ id: skills[skill].id, dps: dps });
      }
      bestDpsOrder.sort((a, b) => b.dps - a.dps);
      while (totalTime < time) {
        for (let skill in bestDpsOrder) {
          if (
            cooldownSkills.find((cooldown) => cooldown.avaliableIn <= totalTime)
          ) {
            updateCooldown(
              skills.find((id) => id.id === bestDpsOrder[skill].id).cooldown,
              bestDpsOrder[skill].id,
            );
            totalDamage += bestDpsOrder[skill].dps;
            totalTime += skills.find(
              (id) => id.id === bestDpsOrder[skill].id,
            ).animation;
            if (totalDamage > time) break;
          }
        }
      }
      return { combo, totalDamage, totalTime, comboMaker, bestDpsOrder };
    };

    //Função para alterar o estado do filtro e ordenar a lista
    const changeIcon = (type) => {
      for (let key in filterList.value) {
        if (key === type) {
          filterList.value[key] = !filterList.value[key]; // Inverte o estado do filtro clicado
        } else {
          filterList.value[key] = false; // Reseta os outros filtros
        }
      }
      sortSkills(type);
    };

    return { skills, filterList, iconList, changeIcon, copySkills, comboMaker };
  },
};
</script>

<style scoped>
.sort-btn {
  background: transparent;
  border: 0;
  padding: 0;
  margin-left: 6px;
  cursor: pointer;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}
.sort-btn:focus {
  outline: 2px solid #4c9ffe; /* foco acessível */
  outline-offset: 2px;
}
.sort-icon {
  display: inline-block; /* não usar block */
  width: 16px;
  height: 12px;
  margin-left: 6px; /* espaço do texto */
  vertical-align: middle; /* alinha verticalmente */
  cursor: pointer;
}

#skills-table {
  width: 60%;
  margin: auto;
}
.th-clickable {
  cursor: pointer;
}

.th-inline {
  display: inline-flex; /* mantém texto e ícone lado a lado */
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.sort-icon {
  display: inline-block;
  width: 16px;
  height: 12px;
  vertical-align: middle;
}
</style>
