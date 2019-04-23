import SherryPolar from "./Polar"
import SherryPieCustomLabelLine from "./PieCustomLabelLine"
import SherryLineCustom from "./LineCustom"

const components = [SherryPolar, SherryPieCustomLabelLine, SherryLineCustom];
export default {
    install(Vue, options) {
        components.forEach(component => {
            Vue.component(component.name, component);
        })
    }
}