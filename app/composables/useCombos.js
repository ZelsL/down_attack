const STORAGE_KEY = "downattack:combos";
let syncPromise = null;

export const useCombos = (playerSource, skillsSource) => {
  const { isAuthenticated } = useAuth();
  const comboIsLoading = ref(true);
  const comboError = ref(null);
  const combos = ref([]);

  function formatBackendError(error, fallbackMessage) {
    const rawMessage =
      error?.data?.message || fallbackMessage || "Failed to process combos.";
    const rawAction = error?.data?.action || "Please try again later.";
    const message = rawMessage.endsWith(".") ? rawMessage : `${rawMessage}.`;
    const action = rawAction.endsWith(".") ? rawAction : `${rawAction}.`;
    return `${message} ${action}`;
  }

  function getLocalCombos() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function setLocalCombos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  async function syncLocalCombosToDatabase() {
    if (syncPromise) {
      return syncPromise;
    }

    const localCombos = getLocalCombos();
    if (!Array.isArray(localCombos) || localCombos.length === 0) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);

    syncPromise = (async () => {
      const failedCombos = [];
      for (const localCombo of localCombos) {
        try {
          await $fetch("/api/v1/combos", {
            method: "POST",
            body: {
              name: localCombo.name,
              class_name: localCombo.class_name,
              spec: localCombo.spec,
              skills: localCombo.skills,
            },
          });
        } catch (error) {
          comboError.value = formatBackendError(
            error,
            "Failed to sync local combos.",
          );
          failedCombos.push(localCombo);
        }
      }

      if (failedCombos.length > 0) {
        setLocalCombos(failedCombos);
      }
    })().finally(() => {
      syncPromise = null;
    });

    return syncPromise;
  }

  async function getCombos() {
    const player = toValue(playerSource);
    const className = player?.class_name;
    const spec = player?.spec;

    comboIsLoading.value = true;
    comboError.value = null;
    try {
      if (isAuthenticated.value) {
        await syncLocalCombosToDatabase();

        const data = await $fetch(`/api/v1/combos`, {
          params: { className, spec },
        });

        combos.value = data;
      } else {
        const allCombos = getLocalCombos();

        const filteredCombos = allCombos.filter((combo) => {
          if (
            className &&
            className.toLowerCase() !== combo.class_name.toLowerCase()
          )
            return false;
          if (spec && spec.toLowerCase() !== combo.spec.toLowerCase())
            return false;
          return true;
        });
        combos.value = filteredCombos;
      }
    } catch (error) {
      comboError.value = formatBackendError(error, "Failed to load combos.");
    } finally {
      comboIsLoading.value = false;
    }
  }

  async function saveCombos(name) {
    const player = toValue(playerSource);
    const skills = toValue(skillsSource);
    const combo = {
      name,
      class_name: player.class_name,
      spec: player.spec,
      skills: skills,
    };
    comboError.value = null;
    try {
      if (isAuthenticated.value) {
        const createdCombo = await $fetch("/api/v1/combos", {
          method: "POST",
          body: combo,
        });

        combos.value.push(createdCombo);
        return createdCombo;
      } else {
        const allCombos = getLocalCombos();
        let comboName = name;
        if (!comboName) {
          const comboDefaultNameRegex = /^Combo #(\d+)$/;
          const usedNumbers = allCombos
            .map((item) => {
              const match = item.name?.match(comboDefaultNameRegex);
              return match ? parseInt(match[1]) : null;
            })
            .filter(Boolean);

          let nextNumber = 1;

          while (usedNumbers.includes(nextNumber)) {
            nextNumber++;
          }

          comboName = `Combo #${nextNumber}`;
        }
        const newCombos = {
          id: crypto.randomUUID(),
          ...combo,
          name: comboName,
        };

        allCombos.push(newCombos);
        setLocalCombos(allCombos);
        combos.value.push(newCombos);
        return newCombos;
      }
    } catch (error) {
      comboError.value = formatBackendError(error, "Failed to save combo.");
    } finally {
      comboIsLoading.value = false;
    }
  }

  async function updateCombos(id, name) {
    const player = toValue(playerSource);
    const skills = toValue(skillsSource);
    const combo = {
      class_name: player.class_name,
      spec: player.spec,
      skills: skills,
    };

    if (name) {
      combo.name = name;
    }

    function updateCombo(updatedCombo) {
      combos.value = combos.value.map((item) => {
        if (item.id === id) {
          return updatedCombo || { ...item, ...combo };
        } else {
          return item;
        }
      });
    }
    comboError.value = null;
    try {
      if (isAuthenticated.value) {
        const updatedCombo = await $fetch(`/api/v1/combos/${id}`, {
          method: "PATCH",
          body: combo,
        });

        updateCombo(updatedCombo);
      } else {
        const allCombos = getLocalCombos();
        const updatedCombo = allCombos.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...combo,
            };
          } else {
            return item;
          }
        });

        setLocalCombos(updatedCombo);
        updateCombo();
      }
    } catch (error) {
      comboError.value = formatBackendError(error, "Failed to update combo.");
    } finally {
      comboIsLoading.value = false;
    }
  }
  async function deleteCombos(id) {
    function deleteCombo() {
      combos.value = combos.value.filter((item) => item.id !== id);
    }
    comboError.value = null;
    try {
      if (isAuthenticated.value) {
        const comboToDelete = await $fetch(`/api/v1/combos/${id}`, {
          method: "DELETE",
        });

        deleteCombo(comboToDelete);
      } else {
        const allCombos = getLocalCombos();
        const comboToDelete = allCombos.filter((item) => item.id !== id);
        setLocalCombos(comboToDelete);
        deleteCombo(comboToDelete);
      }
    } catch (error) {
      comboError.value = formatBackendError(error, "Failed to delete combo.");
    } finally {
      comboIsLoading.value = false;
    }
  }

  function reorderCombos(fromIndex, toIndex) {
    if (
      fromIndex === null ||
      toIndex === null ||
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= combos.value.length ||
      toIndex >= combos.value.length
    ) {
      return;
    }

    const updated = [...combos.value];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    combos.value = updated;

    if (!isAuthenticated.value) {
      const allCombos = getLocalCombos();
      const movedIds = new Set(updated.map((c) => c.id));
      let reorderedIndex = 0;
      const syncedAllCombos = allCombos.map((item) => {
        if (movedIds.has(item.id)) {
          return updated[reorderedIndex++];
        }
        return item;
      });
      setLocalCombos(syncedAllCombos);
    }
  }

  return {
    getCombos,
    saveCombos,
    updateCombos,
    deleteCombos,
    reorderCombos,
    comboIsLoading,
    comboError,
    combos,
  };
};
