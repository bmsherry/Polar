import SherryPolar from "./Polar"
import SherryPieCustomLabelLine from "./PieCustomLabelLine"

const components = [SherryPolar,SherryPieCustomLabelLine];
export default {
    install(Vue,options){
        components.forEach(component=>{
            Vue.component(component.name, component);
        })       
    }
}