import { createRouter, createWebHistory } from 'vue-router';
import Interactions from './pages/Interactions.vue';
import UsersList from './pages/UsersList.vue';
import UserCreate from './pages/UserCreate.vue';
import UserEdit from './pages/UserEdit.vue';
import UserDetail from './pages/UserDetail.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Interactions },
    { path: '/crud/users', name: 'users-list', component: UsersList },
    { path: '/crud/users/create', name: 'users-create', component: UserCreate },
    { path: '/crud/users/:id/edit', name: 'users-edit', component: UserEdit },
    { path: '/crud/users/:id', name: 'users-detail', component: UserDetail },
  ],
});
