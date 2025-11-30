import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/user/LandingPage.vue";
import Auth from "../components/Auth.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import UserDashboard from "../components/user/UserDashboard.vue";
import Verify from "../components/verify.vue";
import ProductsView from "../components/user/ProductsView.vue"; // Add this import
import ContactView from "../components/user/ContactView.vue"; // Add this import
import MyOrders from "../components/user/MyOrders.vue"; // Add this import

const routes = [
  // LANDING PAGE (first page)
  {
    path: "/",
    component: LandingPage,
    name: "home",
  },

  // AUTH PAGE (login/register)
  {
    path: "/auth",
    component: Auth,
    name: "auth",
  },

  // VERIFY PAGE
  {
    path: "/verify",
    component: Verify,
    name: "verify",
  },

  // USER ROUTES
  {
    path: "/products",
    component: ProductsView,
    name: "products",
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/contact",
    component: ContactView,
    name: "contact",
  },
  {
    path: "/my-orders",
    component: MyOrders,
    name: "my-orders",
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/user",
    component: UserDashboard,
    name: "user-dashboard",
    meta: { requiresAuth: true, role: "user" },
  },

  // ADMIN ROUTE
  {
    path: "/admin",
    component: AdminDashboard,
    name: "admin-dashboard",
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth) {
    if (!token) return next("/auth");
    if (to.meta.role && to.meta.role !== role) return next("/auth");
  }

  next();
});

export default router;
