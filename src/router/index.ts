import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import PrivateMessageView from "@/views/PrivateMessageView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView
        },
        {
            path: '/private-message/:userName',
            name: 'PrivateMessage',
            component: PrivateMessageView,
            props: true
        }

    ]
})

export default router