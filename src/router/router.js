const routes = [{
    path: '/home',
    name: 'home',
    component: r => require.ensure([], () => r(require('@/views/Home')), 'Home'),
}, {
    path: '/cloth',
    name: 'cloth',
    component: r => require.ensure([], () => r(require('@/views/Three/Cloth')), 'Cloth')
}, {
    path: '/shader',
    name: 'shader',
    component: r => require.ensure([], () => r(require('@/views/Three/Shader')), 'Shader')
}, {
    path: '/threedworld',
    name: 'threedworld',
    component: r => require.ensure([], () => r(require('@/views/Three/ThreeDWorld')), 'ThreeDWorld')
}, {
    path: '/snow',
    name: 'snow',
    component: r => require.ensure([], () => r(require('@/views/Three/Snow')), 'Snow')
}, {
    path: '/',
    redirect: '/home'
}]

export default routes