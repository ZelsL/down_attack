<template>
    <div class="admin-layout">
        <aside class="menu">
            <p class="menu-label">General</p>
            <ul class="menu-list">
                <li><a @click="chooseMenuItem('dashboard')" :class="{ 'is-active': showDashboard}">Dashboard</a></li>
            </ul>
            <p class="menu-label">Administration</p>
            <ul class="menu-list">
                <li><a @click="chooseMenuItem('Calculator Presets'), getAllPresets()" :class="{ 'is-active': showCalculatorPresets}">Calculator Presets</a></li>
                <li><a @click="chooseMenuItem('Skills Management')" :class="{ 'is-active': showSkillsManagement}">Skills Management</a></li>
            </ul>
        </aside>
        <div class="content">
            <div class="header">
                <h1 class="title is-3">Admin Page</h1>          
            </div>
            <div class="admin-main-content">
                <div v-if="showSkillsManagement">
                    <h2 class="title is-5">Skills Management</h2>
                    <p>Manage your skills here.</p>
                    <button @click="newSkill()" class="button is-primary">+</button>
                    <div>
                        <SkillsManager
                        :selectedClass="'hashashin'"
                        />
                    </div>
                </div>
                <div v-if="showCalculatorPresets">
                    <h2 class="title is-5">Calculator Presets</h2>
                    <p>Manage your calculator presets here.</p>
                    
                    <button @click="newPreset()" class="button is-primary">+</button>

                    <div v-show="newPresetModalVisible">
                        <PresetFormModal
                        v-model="calculatorPresetsStatus"
                        label="New Preset"
                        :modalErrorMsg="modalErrorMsg"
                        :showModalNotification="showModalModification"
                        :modalSaveMsg="modalSaveMsg"
                        :modalSaveError="modalSaveError"
                        @save-preset="savePreset($event)"
                        @close-notification="showModalModification = !showModalModification"
                        @close-modal="newPresetModalVisible = !newPresetModalVisible"
                        />
                    </div>
                    <div v-show="editPresetModalVisible">
                        <PresetFormModal
                        v-model="calculatorPresetsStatus"
                        label="Edit Preset"
                        :modalErrorMsg="modalErrorMsg"
                        :showModalNotification="showModalModification"
                        :modalSaveMsg="modalSaveMsg"
                        :modalSaveError="modalSaveError"
                        @save-preset="savePreset($event)"
                        @close-notification="showModalModification = !showModalModification"
                        @close-modal="editPresetModalVisible = !editPresetModalVisible"
                        />
                    </div>
                    

                    <nav class="mt-5 panel">
                    <p class="panel-heading">Repositories</p>
                    <div class="panel-block">
                        <p class="control has-icons-left">
                        <input class="input" type="text" placeholder="Search" />
                        <span class="icon is-left">
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </span>
                        </p>
                    </div>
                    <p class="panel-tabs">
                        <a class="is-active">All</a>
                        <a>Public</a>
                        <a>Private</a>
                        <a>Sources</a>
                        <a>Forks</a>
                    </p>
                    <a v-for="preset in allCalculatorPresets" :key="preset.id" class="panel-block">
                        <span class="panel-icon">...</span>
                        
                        <div> <strong>{{ preset.name }} | ID: {{ preset.id }}</strong>
                            <p class="is-size-6">Author: {{ preset.author }}</p>
                            <p class="is-size-7 has-text-grey">
                                Class: {{ preset.class_name }} | Spec: {{ preset.class_spec }}
                            </p>
                        </div>
                        <div class="is-flex ml-auto">
                            <button class="button is-white is-outlined mr-1" @click="editPreset(preset.id)">
                                <span>Edit</span>
                            </button>                                             
                            <button @click="deletePreset(preset.id)" class="button is-danger is-outlined">
                                <span>Delete</span> 
                                <i class="ml-1 delete is-small has-background-danger"></i>
                            </button>
                        </div>
                    </a>
                    <div class="panel-block">
                        <button class="button is-link is-outlined is-fullwidth">
                        Reset all filters
                        </button>
                    </div>
                    </nav> 

                    <div v-show="showDeleteNotification" class="notification" :class="deleteError ? 'is-danger': 'is-primary'">
                        <button class="delete" @click="showDeleteNotification = !showDeleteNotification"></button>
                        {{ deleteMessage }}
                    </div>
                    
                </div>
                
                <div v-if="showDashboard">
                    <h2 class="title is-5">Welcome to the Admin Dashboard</h2>
                    <p>Select an option from the menu to get started.</p>
                    
                </div>
            </div>              
        </div>
    </div>
    

</template>
<script>
import { ref } from 'vue';
import apiClient from '@/services/api';
import PresetFormModal from '@/components/PresetFormModal.vue';
import SkillsManager from '@/components/SkillsManager.vue';
export default {
    name: 'adminView',
    components: {
        PresetFormModal,
        SkillsManager
    },
    setup() {
        let classes = ref([
        'Warrior Succession', 'Warrior Awakening', 'Sorceress Succession', 'Sorceress Awakening',
        'Ranger Succession', 'Ranger Awakening', 'Berserker Succession', 'Berserker Awakening',
        'Tamer Succession', 'Tamer Awakening', 'Musa Succession', 'Musa Awakening',
        'Maehwa Succession', 'Maehwa Awakening', 'Valkyrie Succession', 'Valkyrie Awakening',
        'Wizard Succession', 'Wizard Awakening', 'Witch Succession', 'Witch Awakening',
        'Ninja Succession', 'Ninja Awakening', 'Kunoichi Succession','Kunoichi Awakening',
        'Dark Knight Succession', 'Dark Knight Awakening', 'Striker Succession', 'Striker Awakening',
        'Mystic Succession', 'Mystic Awakening', 'Lahn Succession', 'Lahn Awakening', 'Archer Awakening',
        'Corsair Succession', 'Corsair Awakening', 'Drakania Succession', 'Drakania Awakening',
        'Woosa Succession', 'Woosa Awakening', 'Maegu Succession', 'Maegu Awakening', 'Scholar Awakening',
        'Hashashin Succession', 'Hashashin Awakening', 'Deadeye Awakening', 'Wukong Awakening', 'Shai Succession'
        ]);        

        const showDashboard = ref(true);
        const showCalculatorPresets = ref(false);
        const showSkillsManagement = ref(false);
        let allCalculatorPresets = ref({});
        const newPresetModalVisible = ref(false);
        const newSkillModalVisible = ref(false);
        const newSkillData = ref({});
        const editPresetModalVisible = ref(false);
        let modalSaveError = ref(false);
        let modalErrorMsg = ref('');
        let showModalModification = ref(false);
        let modalSaveMsg = ref('');
        let deleteMessage = ref('');
        let showDeleteNotification = ref(false);
        let deleteError = ref(false);



        const calculatorPresetsStatus = ref({
            id: null,
            name: '',
            class_name: '',
            class_spec: '',
            total_ap_pvp: 0,
            total_aap_pvp: 0,
            sheet_ap: 0,
            sheet_aap: 0,
            accuracy: 0,
            critical_hit_rate: 0.0,
            critical: 0.0,
            back_attack: 0.0,
            down_attack: 0.0,
            air_attack: 0.0,
            skill_damage_percent: 0.0,
            skill_pvp_reduction_percent: 0.0,
            skill_spec: '',
            attacker_state: '',
            hp: 0,
            melee_dr: 0,
            ranged_dr: 0,
            magic_dr: 0,
            melee_evasion: 0,
            ranged_evasion: 0,
            magic_evasion: 0,
            dr_percent: 0
        });

        const getAllPresets = async () => {
            try {
                const response = await apiClient.get('pvp-calculator/presets')

                if (!response.data.success) {
                    throw new Error('Network response was not ok');
                }
                
                allCalculatorPresets.value = response.data.presets;
            } catch (error) {
                console.error('Error fetching calculator presets:', error);
            }
        };

        const deletePreset = async(id)=>{
            try{
                deleteError.value = false
                showDeleteNotification.value = false
                const response = await apiClient.delete(`/pvp-calculator/presets/${id}`);
                deleteMessage.value = response.data.message;
                if (response.data.success){
                    let filterById = (preset)=> preset.id !== id;             
                    allCalculatorPresets.value = allCalculatorPresets.value.filter(filterById)
                }
            }catch(error){
                deleteMessage.value = error.response?.data?.error || error.message;
                deleteError.value = true
                showDeleteNotification.value = true
            }
        }

        const savePreset = async (presetData) => {
            try {
                modalSaveError.value = false
                showModalModification.value = false
                let method;
                let url;
                let msg;

                if(presetData.id){
                    method = 'put';
                    url = `/pvp-calculator/presets/${presetData.id}`
                    msg = 'Preset updated successfully: '
                }else{
                    method = 'post',
                    url = '/pvp-calculator/presets'
                    msg = 'Preset created successfully: '
                }


                const response = await apiClient[method](url, {
                    name: presetData.name,
                    class_name: presetData.class_name,
                    class_spec: presetData.class_spec,
                    total_ap_pvp: presetData.total_ap_pvp,
                    total_aap_pvp: presetData.total_aap_pvp,
                    sheet_ap: presetData.sheet_ap,
                    sheet_aap: presetData.sheet_aap,
                    accuracy: presetData.accuracy,
                    critical_hit_rate: presetData.critical_hit_rate,
                    critical: presetData.critical,
                    back_attack: presetData.back_attack,
                    down_attack: presetData.down_attack,
                    air_attack: presetData.air_attack,
                    skill_damage_percent: presetData.skill_damage_percent,
                    skill_pvp_reduction_percent: presetData.skill_pvp_reduction_percent,
                    skill_spec: presetData.skill_spec,
                    attacker_state: presetData.attacker_state,
                    hp: presetData.hp,
                    melee_dr: presetData.melee_dr,
                    ranged_dr: presetData.ranged_dr,
                    magic_dr: presetData.magic_dr,
                    melee_evasion: presetData.melee_evasion,
                    ranged_evasion: presetData.ranged_evasion,
                    magic_evasion: presetData.magic_evasion,
                    dr_percent: presetData.dr_percent,
                    admin: true
                });

                if (response.data.success === false) {
                    throw new Error('Network response was not ok');
                }
                const presetId = response.data.presetId;
                const newPreset = response.data.preset;
                if(method === 'post'){
                    allCalculatorPresets.value.push(newPreset);  
                }else{
                    const preset = allCalculatorPresets.value.find(preset => preset.id === presetData.id )
                    if (preset){
                        Object.assign(preset, presetData);
                    }
                }
                  
                modalSaveMsg.value = msg + presetId;
                showModalModification.value = true
            } catch (error) {
                modalErrorMsg.value = error.response?.data?.error || error.message;
                showModalModification.value = true
                modalSaveError.value = true
                
            }
        };

        const newPreset = () => {
            newPresetModalVisible.value = !newPresetModalVisible.value
            showModalModification.value = false
            calculatorPresetsStatus.value = {
                id: null,
                name: '',
                class_name: '',
                class_spec: '',
                total_ap_pvp: 0,
                total_aap_pvp: 0,
                sheet_ap: 0,
                sheet_aap: 0,
                accuracy: 0,
                critical_hit_rate: 0.0,
                critical: 0.0,
                back_attack: 0.0,
                down_attack: 0.0,
                air_attack: 0.0,
                skill_damage_percent: 0.0,
                skill_pvp_reduction_percent: 0.0,
                skill_spec: '',
                attacker_state: '',
                hp: 0,
                melee_dr: 0,
                ranged_dr: 0,
                magic_dr: 0,
                melee_evasion: 0,
                ranged_evasion: 0,
                magic_evasion: 0,
                dr_percent: 0
            };
        }

        const editPreset = async(id) =>{
            showModalModification.value = false
            let newStats = await getPresetById(id);
            calculatorPresetsStatus.value = {
                id: id,
                name: newStats.name,
                class_name: newStats.class_name,
                class_spec: newStats.class_spec,
                total_ap_pvp: newStats.total_ap_pvp,
                total_aap_pvp: newStats.total_aap_pvp,
                sheet_ap: newStats.sheet_ap,
                sheet_aap: newStats.sheet_aap,
                accuracy: newStats.accuracy,
                critical_hit_rate: newStats.critical_hit_rate,
                critical: newStats.critical,
                back_attack: newStats.back_attack,
                down_attack: newStats.down_attack,
                air_attack: newStats.air_attack,
                skill_damage_percent: newStats.skill_damage_percent,
                skill_pvp_reduction_percent: newStats.skill_pvp_reduction_percent,
                skill_spec: newStats.skill_spec,
                attacker_state: newStats.attacker_state,
                hp: newStats.hp,
                melee_dr: newStats.melee_dr,
                ranged_dr: newStats.ranged_dr,
                magic_dr: newStats.magic_dr,
                melee_evasion: newStats.melee_evasion,
                ranged_evasion: newStats.ranged_evasion,
                magic_evasion: newStats.magic_evasion,
                dr_percent: newStats.dr_percent
            };
            editPresetModalVisible.value = !editPresetModalVisible.value;
        }

        const chooseMenuItem = (item) => {
            const menuMap = {
                'Calculator Presets': 'showCalculatorPresets',
                'Skills Management': 'showSkillsManagement',
                'dashboard': 'showDashboard'
            };
            showCalculatorPresets.value = false;
            showSkillsManagement.value = false;
            showDashboard.value = false;
            if (menuMap[item]) {
                eval(menuMap[item] + ".value = true");
            }
        };

        const newSkill = () => {
            // Logic to open new skill modal
        }

        const getPresetById = async (id) =>{
            try{
                const response = await apiClient.get(`/pvp-calculator/presets/${id}`);
                if (response.data.success)
                return response.data.preset

            }catch(error){
                console.error('Error to fetching id' + error);
            }
        }        


        return {
            showCalculatorPresets,
            getAllPresets,
            savePreset,
            newPresetModalVisible,
            calculatorPresetsStatus,
            modalSaveMsg,
            modalSaveError,
            modalErrorMsg,
            showModalModification,
            allCalculatorPresets,
            deleteMessage,
            deletePreset,
            deleteError,
            showDeleteNotification,
            getPresetById,
            newPreset,
            editPreset,
            editPresetModalVisible,
            showSkillsManagement,
            showDashboard,
            chooseMenuItem,
            newSkill,
            newSkillData,
            newSkillModalVisible,
            classes
        }
    }
}

</script>
<style scoped>

.admin-layout {
    padding: 20px;
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-gap: 10px;
}
.menu {
    border-right: 1px solid #ddd;
    background-color: #12161b;
}
.admin-main-content {
    padding: 20px;
    border-radius: 5px;
    width: 100%;
}
</style>
