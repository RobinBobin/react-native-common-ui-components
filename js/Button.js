import React from "react";
import {
   TouchableOpacity,
   Text
} from "react-native";
import { autobind } from "core-decorators";
import {
   styles,
   combineStyles
} from "react-native-common-ui-components/js/styles";

@autobind
export default class Button extends React.Component {
   render() {
      const stl = combineStyles(styles.button, this.props.disabled ? styles.buttonDisabled : null, this.props.style);
      
      return <TouchableOpacity
         onPress={this.props.onPress || (() => alert(this.props.text))}
         disabled={this.props.disabled}
         activeOpacity={styles.activeOpacity}
         style={stl.container}>
         { this.props.text && <Text style={stl.text}>{this.props.text}</Text> }
         { this.props.children }
      </TouchableOpacity>;
   }
}
