<script setup>
import { ref, onMounted } from 'vue'
import axiosApiInstance from '@/api'

import AppCard from 'primevue/card'
import AppLoader from '@/components/AppLoader.vue'

const cars = ref([])
const showLoader = ref(false)

const getAllCars = async () => {
    showLoader.value = true
    try {
        const response = await axiosApiInstance.get(`https://jwt-auth-2f15e-default-rtdb.europe-west1.firebasedatabase.app/cars.json`)
        cars.value = response.data
    }
    catch (err) {
        console.log(err.response);
    } finally {
        showLoader.value = false
    }
}

onMounted(async () => {
    await getAllCars()
})
</script>

<template>
    <h2>Cars</h2>
    <AppLoader v-if="showLoader"/>
    <div class="flex flex-column gap-3" v-else>
      <app-card card v-for="(car, i) in cars" :key="i">
        <template #title> {{car.color}} </template>
        <template #subtitle> {{car.volume}} </template>
      </app-card>
    </div>
</template>