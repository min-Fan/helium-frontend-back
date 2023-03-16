export const routes = [
  {
    path: "/404",
    name: "404",
    meta: { requireAuth: false },
    component: (resolve) => require(["@/views/404"], resolve),
  },
  {
    path: "/",
    name: "Home",
    redirect: "/Trading",
    meta: { title: "" },
    component: () => import("@/views/Main"),
    children: [
      // {
      //     path: 'Home',
      //     meta: { title: '' },
      //     component: () => import('@/views/EsgExchange')
      // },
      // {
      //     path: 'BlindBox',
      //     meta: { title: '' },
      //     component: () => import('@/views/BlindBox')
      // },
      // {
      //     path: 'Nuclear',
      //     meta: { title: '' },
      //     component: () => import('@/views/Nuclear')
      // },
      // {
      //     path: 'MaskBaby',
      //     meta: { title: '' },
      //     component: () => import('@/views/MaskBaby')
      // },
      // {
      //     path: 'CardList/:type?',
      //     meta: { title: '' },
      //     component: () => import('@/views/CardList')
      // },
      // {
      //     path: 'Team',
      //     meta: { title: '' },
      //     component: () => import('@/views/Team')
      // },
      // {
      //     path: 'LuckyNumber',
      //     meta: { title: '' },
      //     component: () => import('@/views/LuckyNumber')
      // },
      // {
      //     path: 'Announcement',
      //     meta: { title: '' },
      //     component: () => import('@/views/Announcement')
      // },
      // {
      //     path: 'Spaceship',
      //     meta: { title: '' },
      //     component: () => import('@/views/Spaceship')
      // },
      // {
      //     path: 'Detail',
      //     meta: { title: '' },
      //     component: () => import('@/views/Detail')
      // },
      // {
      //     path: 'Boost',
      //     meta: { title: '' },
      //     component: () => import('@/views/Boost')
      // },
      // {
      //     path: 'Upgrade',
      //     meta: { title: '' },
      //     component: () => import('@/views/Upgrade')
      // },
      // {
      //     path: 'Income',
      //     meta: { title: '' },
      //     component: () => import('@/views/Income')
      // },
      // {
      //     path: 'IncomeDetail',
      //     meta: { title: '' },
      //     component: () => import('@/views/IncomeDetail')
      // },
      // {
      //     path: 'EsgExchange',
      //     meta: { title: '' },
      //     component: () => import('@/views/EsgExchange')
      // },
      // // {
      // //   path: 'Map',
      // //   meta: { title: '' },
      // //   component: () => import('@/views/Map')
      // // },
      // {
      //   path: 'SingleDetails',
      //   meta: { title: '' },
      //   component: () => import('@/views/SingleDetails')
      // },
      // {
      //     path: 'Dividend',
      //     meta: { title: '' },
      //     component: () => import('@/views/Dividend')
      // },
      {
        path: "Trading",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/Trading"),
      },
      {
        path: "NFTexchange",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/NFTexchange"),
      },
      {
        path: "Mobility",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/Mobility"),
      },
      // {
      //     path: 'LuckyPool',
      //     meta: { title: '', keepAlive: true }, // 需要被缓存的页面
      //     component: () => import('@/views/v2main/LuckyPool')
      // },
      {
        path: "HashBump",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/HashBump"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/BPoS",
    meta: { title: "" },
    component: () => import("@/views/Main"),
    children: [
      {
        path: "BPoS",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/BPoS"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/LpBPoS",
    meta: { title: "" },
    component: () => import("@/views/Main"),
    children: [
      {
        path: "LpBPoS",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/LpBPoS"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/Staking",
    meta: { title: "" },
    component: () => import("@/views/Main"),
    children: [
      {
        path: "Staking",
        meta: { title: "", keepAlive: true }, // 需要被缓存的页面
        component: () => import("@/views/v2main/Staking"),
      },
    ],
  },
  {
    path: "/ExchangeRecord",
    name: "ExchangeRecord",
    meta: { title: "", keepAlive: true },
    component: () => import("@/views/v2main/ExchangeRecord"),
  },
  {
    path: "/BPoS/GetRecord",
    name: "GetRecord",
    meta: { title: "", keepAlive: true },
    component: () => import("@/views/v2main/GetRecord"),
  },
  {
    path: "/LpBPoS/LpGetRecord",
    name: "LpGetRecord",
    meta: { title: "", keepAlive: true },
    component: () => import("@/views/v2main/LpGetRecord"),
  },
  {
    path: "/BPoS/ShareDetails",
    name: "ShareDetails",
    meta: { title: "", keepAlive: true }, // 需要被缓存的页面
    component: () => import("@/views/v2main/ShareDetails"),
  },
  {
    path: "/LpBPoS/LpDetails",
    name: "LpDetails",
    meta: { title: "", keepAlive: true }, // 需要被缓存的页面
    component: () => import("@/views/v2main/LpDetails"),
  },
  {
    path: "/Staking/StakDetails",
    name: "StakDetails",
    meta: { title: "", keepAlive: true }, // 需要被缓存的页面
    component: () => import("@/views/v2main/StakDetails"),
  },
  {
    path: "/BPoS/AllRecord",
    name: "AllRecord",
    meta: { title: "", keepAlive: true }, // 需要被缓存的页面
    component: () => import("@/views/v2main/AllRecord"),
  },
  {
    path: "/LpBPoS/LpAllRecord",
    name: "LpAllRecord",
    meta: { title: "", keepAlive: true }, // 需要被缓存的页面
    component: () => import("@/views/v2main/LpAllRecord"),
  },
  // {
  //     path: '/Success',
  //     meta: { title: '' },
  //     component: () => import('@/views/Success')
  // }
];
