import React from "react";
import {
   TouchableOpacity,
   Text
} from "react-native";
import { autobind } from "core-decorators";
import { styles } from "react-native-common-ui-components/js/styles";
import { AlterStyles } from "react-native-common-utils";

@autobind
export default class Button extends React.Component {
   constructor(props) {
      super(props);
      
      this.styles = [
         AlterStyles.combineEx(this.props.styles, styles.button),
         AlterStyles.combineEx(this.props.stylesDisabled, styles.buttonDisabled)
      ];
   }
   
   render() {
      const stls = {};
      
      for (let name of ["container", "text"]) {
         stls[name] = [];
         
         for (let i = 0; i < this.styles.length - +!this.props.disabled; i++) {
            stls[name].push(this.styles[i][name]);
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
