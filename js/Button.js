import React from "react";
import {
   TouchableOpacity,
   Text
} from "react-native";
import { autobind } from "core-decorators";
import { styles } from "react-native-common-ui-components/js/styles";

@autobind
export default class Button extends React.Component {
   render() {
      const stls = {};
      
      for (let name of ["container", "text"]) {
         stls[name] = [styles.button[name]];
         
         if (this.props.disabled) {
            stls[name].push(styles.buttonDisabled[name]);
         }
         
         if (this.props.style) {
            stls[name].push(this.props.style[name]);
         }
      }
      
      return <TouchableOpacity
         onPress={this.props.onPress || (() => alert(this.props.text))}
         disabled={this.props.disabled}
         activeOpacity={styles.activeOpacity}
         style={stls.container}>
         { this.props.text && <Text style={stls.text}>{this.props.text}</Text> }
         { this.props.children }
      </TouchableOpacity>;
   }
}
