import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/welcome"
    },
    {
      path: "/welcome",
      component : () => import("@/views/WelcomeView.vue"),
    },
    {
      path: "/system",
      component : () => import("@/views/SystemView.vue"),
      children: [
        {
          path: "/system/monitor",
          component : () => import("@/views/system/MonitorView.vue"),
        },
        {
          path: "/system/defender",
          component : () => import("@/views/system/DefenderView.vue"),
        },
        {
          path: "/system/soul-frequency",
          component : () => import("@/views/system/SoulFrequencyView.vue"),
        },
        {
          path: "/system/character",
          component : () => import("@/views/system/CharacterView.vue"),
        },
        {
          path: "/system/dimension",
          component : () => import("@/views/system/DimensionView.vue"),
        }
      ]
    }
  ],
})

export default router
