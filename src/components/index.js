import SherryPolar from "./Polar"

const components = [SherryPolar];
export default {
    install(Vue,options){
        components.forEach(component=>{
            Vue.component(component.name, component);
        })       
    }
}