import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import PrivateMessageView from "@/views/PrivateMessageView.vue";
import CreateGroupChatForm from "@/components/forms/CreateGroupChatForm.vue";
import io from "socket.io-client";
import Profil from '@/views/ProfilView.vue'

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
            path: '/private-message/:userId',
            name: 'PrivateMessage',
            component: PrivateMessageView,
            props: true
        },
        {
            path: '/general-chat',
            name: 'GeneralChat',
            component: CreateGroupChatForm
        },
        {
            path: '/profil',
            name: 'Profil',
            component: Profil,
            props: true
        },
        {
            path: '/',
            redirect: '/login'
        }

    ]
})


router.beforeEach((to, _from, next) => {
    const publicRoutes: Array<string> = ['/login', '/register']
    const authRequired: boolean = !publicRoutes.includes(to.path);
    const localStorageToken: string | null = localStorage.getItem('token')
    const localStorageUser: string | null = localStorage.getItem('user')
    const connectedUser = localStorageUser ? JSON.parse(localStorageUser) : null
    const userIsConnected: boolean = localStorageToken && connectedUser

     // if current route is not public and user is logged in, socket emit joinConnectedUsers
    if(authRequired && userIsConnected){
        const socket = io('http://localhost:3001');
        socket.emit('joinConnectedUsers', connectedUser.id)
        return next()
    }

    if(authRequired) {
        return next({ name: 'login' })
    }

    next()
})

export default router
