import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';
import Home from '../views/Home.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import AdminView from '../views/AdminView.vue';
import LocationView from '../views/LocationView.vue';
import TeamManagementView from '../views/TeamManagementView.vue';
import ContestManagementView from '../views/ContestManagementView.vue';
import RoundManagementView from '../views/RoundManagementView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/location/:id',
    name: 'Location',
    component: LocationView
  },
  {
    path: '/location/:id/teams',
    name: 'TeamManagement',
    component: TeamManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/location/:id/contests',
    name: 'ContestManagement',
    component: ContestManagementView,
    meta: { requiresAuth: true }
  },
  {
    path: '/contest/:contestId/rounds',
    name: 'RoundManagement',
    component: RoundManagementView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
