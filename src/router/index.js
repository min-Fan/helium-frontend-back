import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'


const option = {
  mode: "history",
  routes,
  scrollBehavior: () => ({ y: 0 })
}

Vue.use(VueRouter);

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter(option);

export default router;
