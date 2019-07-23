import React from "react";
import { styles } from "react-native-common-utils/js/styles";
import {
   AlterStyles,
   StaticUtils
} from "react-native-common-utils";
import ToggleButton from "./ToggleButton";

export default class SimpleToggleButton extends React.Component {
   render() {
      const stylesData = [
         [styles.toggleButtons.$button.container.inactive, "container.inactive"]
      ];
      
      if (this.props.index == this.props.parent.state.currentIndex) {
         stylesData.push([styles.toggleButtons.$button.
            container.active, "container.active"]);
      }
      
      return <ToggleButton {...this.props} style={StaticUtils.objectToArray(
         AlterStyles.combine(this.props.styles, stylesData).container)} />
   }
}
