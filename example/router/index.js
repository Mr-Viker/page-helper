import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import admin from '@ewan/ewan-admin';
import { Message, MessageBox, Notification } from '@ewan/ewan-ui';

const modulesFiles = require.context("./modules",true,/\.[jt]s$/);
// you do not need `import app from './modules/app'`
// it will auto require all router module from modules file
const modules = modulesFiles.keys().reduce((modules,modulePath) => {
    const value = modulesFiles(modulePath);
    modules.push(value.default)
    return modules;
},[]);
export const asyncRouterMap = modules;

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
    {
        path: '/',
        component: admin.layout,
        redirect: 'dashboard',
        meta: {title: '首页', icon: 'el-icon-menu'},
    }
    // {
    //     path:'/test',
    //     component: (resolve) => require(['@/myViews/test'], resolve),
    // }
];

const adminRouter = new Router({
    mode: 'history',
    base: '/ads/',
    routes: constantRouterMap,
});


export default adminRouter;
