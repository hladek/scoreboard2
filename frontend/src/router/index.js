import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import AdminView from '../views/AdminView.vue';
import LocationView from '../views/LocationView.vue';
import TeamManagementView from '../views/TeamManagementView.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAdmin && !user.is_admin) {
    next('/');
  } else {
    next();
  }
});

export default router;
