<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import TenantCard from './TenantCard.vue'
import PeopleCard from './PeopleCard.vue'
import EnergyCard from './EnergyCard.vue'
import EquipmentCard from './EquipmentCard.vue'
import VisitorCard from './VisitorCard.vue'

const store = useDashboardStore()
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <TenantCard :data="store.tenants" :delay="0" />
    <PeopleCard :data="store.people" :delay="1" />
    <EnergyCard :data="store.energy" :delay="2" />
    <EquipmentCard :data="store.equipment" :delay="3" />
    <VisitorCard :data="store.visitors" :delay="4" />
  </div>
</template>
