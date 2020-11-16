import React from "react";
import {
   TouchableOpacity,
   Text
} from "react-native";
import {
   styles,
   combineStyles
} from "react-native-common-ui-components/js/styles";

export default class Button extends React.Component {
   render() {
      const stl = combineStyles(styles.button, this.props.disabled ? styles.buttonDisabled : null, this.props.style);
      
      const props = {...this.props};
      
      for (const data of [
         ["onPress", () => __DEV__ && alert(this.props.text)],
         ["onLongPress", () => __DEV__ && alert(`${this.props.text} (long)`)]
      ]) {
         if (!props[data[0]]) {
            props[data[0]] = data[1];
         }
      }
      
      props.style = stl.container;
      props.activeOpacity = styles.activeOpacity
      
      return <TouchableOpacity {...props}>
         { this.props.text && <Text style={stl.text}>{this.props.text}</Text> }
         { this.props.children }
      </TouchableOpacity>;
   }
}
