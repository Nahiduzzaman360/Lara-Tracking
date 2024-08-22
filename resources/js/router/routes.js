import Home from "../../views/Home.vue"
import NotFound from "../../views/NotFound.vue"
import ShareMyLocation from "../../views/ShareMyLocation.vue"

const routes = [
    {path: '/', component: Home},
    {path: '/share', component: ShareMyLocation, name: 'shareLocation'},
    { path: '/:pathMatch(.*)*', component: NotFound },
]

export default routes