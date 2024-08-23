import Home from "../../views/Home.vue"
import LiveLocation from "../../views/LiveLocation.vue"
import NotFound from "../../views/NotFound.vue"
import ShareMyLocation from "../../views/ShareMyLocation.vue"

const routes = [
    {path: '/', component: Home},
    {path: '/share', component: ShareMyLocation, name: 'shareLocation'},
    {path: '/track/:secret_key', component: LiveLocation, name: 'trackLocation', props: true},
    { path: '/:pathMatch(.*)*', component: NotFound },
]

export default routes