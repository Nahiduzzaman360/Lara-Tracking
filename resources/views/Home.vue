<template>
  <div class="min-h-screen flex flex-col">
    <div class="text-center pt-10">
      <h1 class="text-4xl font-bold mb-4 text-white">Lara Tracking</h1>
      <p class="text-lg mb-6 text-white px-10">A comprehensive application for real-time user location tracking.</p>
    </div>

    <div class="flex flex-col items-center justify-center flex-grow -mt-20">
      <form class="flex gap-2 mb-10" action="#" method="POST" @submit.prevent="trackLocation()">
        <input type="search" placeholder="Secret Code" v-model="secretKey"
          class="px-4 py-2 bg-input rounded-md border border-border focus:ring focus:ring-ring focus:outline-none" required/>
        <button type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-600/80">Locate Now</button>
      </form>

      <button class="rounded-md bg-white px-4 py-2 font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
      @click="shareMyLocation()">
        Share my Location
      </button>

    </div>
  </div>
</template>


<script setup>
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const toast = useToast()
const router = useRouter();
const secretKey = ref("")

function shareMyLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        router.push({name: 'shareLocation'})
      },
      (err) => {
        toast.error(err.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  }
}

function trackLocation(){
  if(secretKey.value){
    router.push({name: 'trackLocation', params: {secret_key: secretKey.value}})
  }
}

</script>