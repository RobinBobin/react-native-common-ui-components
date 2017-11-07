import React from "react";
import {
   TouchableOpacity,
   Text
} from "react-native";
import { autobind } from "core-decorators";
import { styles } from "react-native-common-utils/js/styles";
import { AlterStyles } from "react-native-common-utils";

@autobind
export default class Button extends React.Component {
   constructor(props) {
      super(props);
      
      this.styles = AlterStyles.combineEx(this.props.styles, styles.button);
   }
   
   render() {
      return <TouchableOpacity
         onPress={this.props.onPress || (() => alert(this.props.text))}
         disabled={this.props.disabled}
         activeOpacity={styles.activeOpacity}
         style={new AlterStyles(this.styles.container)
            .addProperty("backgroundColor", this.props.
               disabled, styles.textColorDisabled)
            .build()}>
         { this.props.text && <Text style={this.
            styles.text}>{this.props.text}</Text> }
         { this.props.children }
      </TouchableOpacity>;
   }
}
