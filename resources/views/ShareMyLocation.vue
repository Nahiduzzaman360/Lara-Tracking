<template>
    <div class="text-white">
        <header class="flex justify-between items-center p-4 border-b border-border">
            <div class="flex items-center gap-2">
                <span class="animate-pulse bg-red-700 px-3 py-1 rounded-full">LIVE</span>
                <h2 class="text-xl font-bold">Share My Location</h2>
            </div>
            <button @click="copySecretKey()"
            class="bg-gray-700 px-4 py-2 rounded-md hover:bg-secondary/80 text-xs sm:text-sm md:text-base">Copy Secret Key</button>
        </header>
        <div id="map" class="min-h-screen">
        </div>
    </div>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pusher = inject("pusher");

const latitude = ref(null)
const longitude = ref(null)

const map = ref(null)
const marker = ref(null)

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        console.log(position.coords);
        
        // latitude.value = position.coords.latitude;
        // longitude.value = position.coords.longitude;

        // if (!map.value) {
        //   map.value = L.map('map').setView([latitude.value, longitude.value], 13);
        //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //   }).addTo(map.value);

        //   marker.value = L.marker([latitude.value, longitude.value]).addTo(map.value)
        //     .bindPopup('Person is here!')
        //     .openPopup();
        // } else {
        //   map.value.setView([latitude.value, longitude.value], 13);
        //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //   }).addTo(map.value);
        //   if (marker.value) {
        //     marker.value.setLatLng([latitude.value, longitude.value])
        //       .bindPopup('You are here!')
        //       .openPopup();
        //   }
        // }
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


onMounted(() => {
  var channel = pusher.subscribe('location');
  channel.bind('send-location', function (data) {
    latitude.value = 51.505;
    longitude.value = -0.09;
  });

  getLocation()
})

watch((latitude), function (newValue, oldValue) {
  if (map.value) {
    map.value.setView([latitude.value, longitude.value], 13);

    if (marker.value) {
      marker.value.setLatLng([latitude.value, longitude.value])
        .bindPopup('You are here!')
        .openPopup();
    }
  }
})
</script>