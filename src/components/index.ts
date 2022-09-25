import VDrawer from './VDrawer/VDrawer.vue';
import VFormDialog from './VFormDialog/index.vue';
import VReportTable from './VReportTable/index.vue';
import VTableDialog from './VTableDialog/index.vue';


const installAll = Vue => {
    const components = [
        VDrawer,
        VFormDialog,
        VReportTable,
        VTableDialog,
    ]
    // @ts-ignore
    components.forEach(component => Vue.component(component.options?.name || component.name, component));
}


export {
    installAll,
    VDrawer,
    VFormDialog,
    VReportTable,
    VTableDialog,
}