<template>
    <div id="map" class="min-h-screen"></div>
</template>

<script setup>

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref, toRef, watch } from "vue";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const map = ref(null)
const marker = ref(null)

const props = defineProps({
    lat: Number,
    lon: Number,
})

const lat = toRef(props, 'lat');
const lon = toRef(props, 'lon');

onMounted(() => {
    if (!map.value) {
        map.value = L.map('map').setView([lat.value, lon.value], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map.value);

        marker.value = L.marker([lat.value, lon.value]).addTo(map.value);
    }
})

watch([lat, lon], ([newLat, newLon], [oldLat, oldLon]) => {
    if (map.value) {
        map.value.setView([newLat, newLon], 16);

        if (marker.value) {
            marker.value.setLatLng([newLat, newLon]);
        }
    }
});

</script>