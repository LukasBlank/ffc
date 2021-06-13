import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'DeckSelection',
    component: () => import('../views/Home.vue'),
    props: true,
  },
  {
    path: '/learn',
    name: 'Learn',
    component: () => import('../views/Learn.vue'),
    props: true,
  },
  {
    path: '/learn/:id',
    name: 'Group Learn',
    component: () => import('../views/GroupLearn.vue'),
    props: true,
  },
  {
    path: '/add',
    name: 'Add New Deck',
    component: () => import('../views/AddNewDeck.vue'),
    props: true,
  },
  {
    path: '/thirdparty',
    name: 'Third Party Decks',
    component: () => import('../views/ThirdPartyDecks.vue'),
  },
  {
    path: '/groups',
    name: 'Study Groups',
    component: () => import('../views/Groups.vue'),
  },
  {
    path: '/group/:id',
    name: 'Study Group',
    component: () => import('../views/Group.vue'),
  },
  {
    path: '/add/group',
    name: 'Add Group',
    component: () => import('../views/AddGroup.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
})

export default router
