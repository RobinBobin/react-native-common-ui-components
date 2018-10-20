import React, { PropTypes } from "react";
import { View } from "react-native";

export default class ProgressBar extends React.PureComponent {
   static defaultProps = {
      flex: 1,
      flexDirection: "row",
      size: 15,
      borderRadius: 10,
      borderColor: 0x0000FFFF,
      borderThickness: 2,
      progress: 0,
      progressColor: 0x00FF00FF,
      remainingColor: "white"
   };
   
   static propTypes = {
      progress: props => props.progress < 0 || props.progress > 1 ? new Error("'progress' supplied to 'ProgressBar' is expected to be in the range 0..1 inclusive.") : undefined
   };
   
   render() {
      const stls = this._createStyles();
      
      return <View style={[this.props.style, stls.container]}>
         <View style={stls.progress} />
         <View style={stls.remaining} />
      </View>;
   }
   
   _createStyles() {
      const row = this.props.flexDirection.indexOf("row") != -1;
      const reverse = this.props.flexDirection.indexOf("reverse") != -1;
      
      const progress = {
         flex: this.props.progress,
         backgroundColor: this.props.progressColor
      };
      
      const size = row ? "height" : "width";
      
      if (row) {
         progress[`borderTop${reverse ? "Right" : "Left"}Radius`] = this.props.borderRadius;
         
         progress[`borderBottom${reverse ? "Right" :"Left"}Radius`] = this.props.borderRadius;
      } else {
         progress[`border${reverse ? "Bottom" : "Top"}LeftRadius`] = this.props.borderRadius;
         
         progress[`border${reverse ? "Bottom" : "Top"}RightRadius`] = this.props.borderRadius;
      }
      
      const remaining = {
         flex: 1 - this.props.progress,
         backgroundColor: this.props.remainingColor,
      };
      
      remaining[size] = progress[size];
      
      if (row) {
         remaining.borderTopLeftRadius = progress.borderTopRightRadius;
         
         remaining.borderBottomLeftRadius = progress.borderBottomRightRadius;
         
         remaining.borderTopRightRadius = progress.borderTopLeftRadius;
         
         remaining.borderBottomRightRadius = progress.borderBottomLeftRadius;
      } else {
         remaining.borderTopLeftRadius = progress.borderBottomLeftRadius;
         
         remaining.borderTopRightRadius = progress.borderBottomRightRadius;
         
         remaining.borderBottomLeftRadius = progress.borderTopLeftRadius;
         
         remaining.borderBottomRightRadius = progress.borderTopRightRadius;
      }
      
      const container = {
         flex: this.props.flex,
         flexDirection: this.props.flexDirection,
         height: row ? this.props.size : undefined,
         width: row ? undefined : this.props.size,
         borderRadius: this.props.borderRadius,
         borderWidth: this.props.borderThickness,
         borderColor: this.props.borderColor
      };
      
      return {
         container,
         progress,
         remaining
      };
   }
}
