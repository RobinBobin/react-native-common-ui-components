import React from "react";
import { Image } from "react-native";
import SimpleToggleButton from "./SimpleToggleButton";

export default class ImageToggleButton extends React.Component {
   render() {
      return <SimpleToggleButton {...this.props} >
         <Image source={this.props.value} />
      </SimpleToggleButton>
   }
}
