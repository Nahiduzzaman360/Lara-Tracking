<template>
  <div class="text-white">
    <header class="flex justify-between items-center p-4 border-b border-border">
      <div class="flex items-center gap-2" v-if="status == 'LIVE'">
        <span class="animate-pulse bg-red-700 px-3 py-1 rounded-full">LIVE</span>
        <h2 class="text-xl font-bold">Track Location</h2>
      </div>
      <div class="flex items-center gap-2" v-else>
        <span class="animate-pulse bg-gray-700 px-3 py-1 rounded-full">{{status}}</span>
        <h2 class="text-xl font-bold">Track Location</h2>
      </div>
      <router-link to="/" class="bg-gray-700 px-4 py-2 rounded-md hover:bg-secondary/80 text-xs sm:text-sm md:text-base">Home</router-link>
    </header>

    <Map v-if="latitude && longitude" :lat="parseFloat(latitude)" :lon="parseFloat(longitude)" />

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
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import axiosClient from '../js/axios';
import Map from './components/Map.vue';
import { useRouter } from 'vue-router';

const pusher = inject("pusher");

const intervalId = ref(null)
const latitude = ref(null)
const longitude = ref(null)
const status = ref('Offline')
const lastUpdate = ref(null)

const router = useRouter();
const toast = useToast()
const props = defineProps({
  secret_key: String
});

const handleLocation = (data) =>{
  latitude.value = data.location.lat
  longitude.value = data.location.lon
  lastUpdate.value = data.location.updated_at
  checkStatus()
}

const checkStatus = () => {
  const now = new Date()
  const lastActivity = new Date(lastUpdate.value)
  
  status.value = timeAgo((now - lastActivity));
}

onMounted(() => {   
  axiosClient.post('fetch-location', {
    'secret_key': props.secret_key
  })
    .then(({ data }) => {
      latitude.value = data.lat;
      longitude.value = data.lon;
      lastUpdate.value = data.updated_at;
      
      checkStatus()

      var channel = pusher.subscribe(`location-${props.secret_key}`);
      channel.bind('send-location', handleLocation);

      intervalId.value = setInterval(checkStatus, 5 * 60 * 1000)
    })
    .catch((err)=>{
      toast.error("Invalid Secret Key!")
      router.push({path: '/'})
    })
})

onBeforeUnmount(()=>{
  if(intervalId.value){
    clearInterval(intervalId.value)
  }
})

function timeAgo(ms) {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        const remainingMinutes = minutes % 60;
        return `${hours} hr${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''} ago`;
    } else if (minutes <= 5) {
        return `LIVE`;
    }else{
      return `${minutes} min ago`;
    }
}

</script>