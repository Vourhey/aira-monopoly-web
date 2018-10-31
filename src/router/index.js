import Vue      from 'vue'
import Router   from 'vue-router'
import Page     from '../components/Page'
import FillName from '../components/FillName'
import Profile  from '../components/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Page',
      component: Page
    },
    {
      path: '/fill_name',
      name: 'FillName',
      props: true,
      component: FillName
    },
    {
      path: '/profile',
      name: 'Profile',
      props: true,
      component: Profile
    }
  ]
})
