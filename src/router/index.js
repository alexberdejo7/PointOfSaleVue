import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppointmentLayout from '../views/appointments/AppointmentLayout.vue'
import AuthApi from '../api/AuthApi.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: {requiresAdmin: true},
      children: [
        {
          path: '',
          name: 'admin-appointments',
          component: () => import('../views/admin/AppointmentsView.vue'),
        }
      ]
      
    },
    {
      path: '/reservas',
      name: 'appointments',
      component: AppointmentLayout,
      meta: {requiresAuth: true},
      children: [
        {
          path: '',
          name: 'my-appointments',
          component: () => import('../views/appointments/MyAppointmentsView.vue'),
        },
        {
          path: 'nueva',
          component: () => import('../views/appointments/NewAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'new-appointment',
              component: () => import('../views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'appointment-details',
              component: () => import('../views/appointments/AppointmentView.vue'),
            }
          ]
        },
        
        {
          path: ':id/editar',
          component: () => import('../views/appointments/EditAppointmenteLayout.vue'),
          children: [
            {
              path: '',
              name: 'edit-appointment',
              component: () => import('../views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'edit-appointment-details',
              component: () => import('../views/appointments/AppointmentView.vue'),
            }
          ]
        },
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/AuthLayout.vue'),
      children: [
        {
          path: 'registro',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue')

        },
        {
          path: 'confirmar-cuenta/:token',
          name: 'confirm-account',
          component: () => import('../views/auth/ConfirmAccountView.vue')

        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue')

        },
        {
          path: 'olvide-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPasswordView.vue')

        },
        {
          path: 'olvide-password/:token',
          name: 'new-password',
          component: () => import('../views/auth/NewPasswordView.vue')

        },
      ]
    }
    
  ]
})


//Guard ara revisar auth user
router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)

  if(requiresAuth) {
    try {
      const { data } = await AuthApi.auth()
      if(data.admin) {
        next({name: 'admin'})
      } else {
        next()
      }

    } catch (error) {
      next({name: 'login'})

    }
  } else {
    next()
  }

})

//Revisar el guard para entrar a admin
router.beforeEach( async (to, from, next) => {
  const requiresAdmin = to.matched.some(url => url.meta.requiresAdmin)
  if(requiresAdmin) {
    try {
      await AuthApi.admin()
      next()
    } catch (error) {
      next({name: 'login'})
    }
  } else {
    next()
  }

})



export default router

//08dec