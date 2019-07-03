import SherryPolar from "./Polar"
import SherryPieCustomLabelLine from "./PieCustomLabelLine"
import SherryLineCustom from "./LineCustom"
import SherryDashBoard from "./DashBoard"

const components = [SherryPolar, SherryPieCustomLabelLine, SherryLineCustom, SherryDashBoard];
export default {
    install(Vue, options) {
        components.forEach(component => {
            Vue.component(component.name, component);
        })
    }
}