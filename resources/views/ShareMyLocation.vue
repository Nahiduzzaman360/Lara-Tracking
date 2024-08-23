<template>
  <div class="text-white">
    <header class="flex justify-between items-center p-4 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="animate-pulse bg-red-700 px-3 py-1 rounded-full">LIVE</span>
        <router-link to="/">
          <h2 class="text-xl font-bold">Share My Location</h2>
        </router-link>
      </div>
      <button @click="copySecretKey()"
        class="bg-gray-700 px-4 py-2 rounded-md hover:bg-secondary/80 text-xs sm:text-sm md:text-base">Copy Secret
        Key</button>
    </header>

    <Map v-if="latitude && longitude" :lat="latitude" :lon="longitude" />

    <div v-else role="status" class="absolute inset-x-1/2 inset-y-1/2">
      <svg aria-hidden="true"
        class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor" />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill" />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axiosClient from '../js/axios';
import Cookies from 'js-cookie';
import Map from './components/Map.vue';

const latitude = ref(null)
const longitude = ref(null)
const intervalId = ref(null)
const firstTimeLoading = ref(true)

const secretKey = ref(Cookies.get('secret-key'))

const toast = useToast()

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        console.log(position.coords);

        if (firstTimeLoading.value) {
          axiosClient.post('verify-token', {
            'secret_key': Cookies.get('secret-key') ?? null
          })
            .then(({ data }) => {
              secretKey.value = data['secret-key']
              Cookies.set('secret-key', data['secret-key'], { expires: 7 })
              sendLocationData()
              intervalId.value = setInterval(sendLocationData, 5 * 60 * 1000);
            })

          firstTimeLoading.value = false;
        }
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
  else {
    toast.error("Geolocation is not supported by this browser.")
  }
};

const sendLocationData = () => {
  axiosClient.post('send-location', {
    secret_key: secretKey.value,
    latitude: latitude.value,
    longitude: longitude.value,
  }).then(response => {
    console.log('Location data sent successfully', response.data);
  }).catch(error => {
    console.error('Error sending location data', error);
  });
};


onMounted(() => {
  getLocation()
})

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})

function copySecretKey() {
  if (secretKey.value) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretKey.value).then(() => {
        toast.success("Secret key copied to clipboard")
      })
    } else {
      toast.error("Clipboard copy permission required")
    }
  }

}
</script>