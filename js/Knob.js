import React from "react";
import {
   View,
   Text,
   PanResponder
} from "react-native";
import { autobind } from "core-decorators";
import { styles } from "react-native-common-utils/js/styles";
import {
   StaticUtils,
   AlterStyles
} from "react-native-common-utils";

@autobind
export default class Knob extends React.Component {
   constructor(props) {
      super(props);
      
      this.state = {
         touched: false,
         degrees: 0,
         degreeOffset: 0
      };
      
      this.panResponder = PanResponder.create({
         onStartShouldSetPanResponder: () => true,
         onStartShouldSetPanResponderCapture: () => true,
         onMoveShouldSetPanResponder: () => true,
         onMoveShouldSetPanResponderCapture: () => true,
         onPanResponderGrant: this._onTouch,
         onPanResponderMove: this._onMove,
         onPanResponderRelease: this._onTouchSucceeded,
         onPanResponderTerminate: this._onTouchFailed
      });
      
      this.styles = AlterStyles.combineEx(this.props.styles, styles.knob);
      
      [
         ["container", "$radius"],
         ["marker", "$markerRadius"]
      ].forEach(data => {
         const radius = this.styles[data[1]];
         
         this.styles[data[0]][0].push({
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius
         });
      });
   }
   
   render() {
      const diff = this.styles.$radius - this.styles.$markerRadius;
      const angle = -StaticUtils.deg2Rad(this.state.degrees);
      
      const container = [this.styles.container, {
         backgroundColor: this._getBackgroundColor()
      }];
      
      const marker = [this.styles.marker, {
         left: diff + Math.cos(angle) * this.styles.$markerDistance,
         top: diff - Math.sin(angle) * this.styles.$markerDistance
      }];
      
      return <View style={container} { ...this.panResponder.panHandlers }>
         <View style={marker} />
         <Text style={this.styles.valueText}>
            {StaticUtils.round(this.state.degrees, 0)}</Text>
         <Text style={this.styles.uomText}>deg</Text>
      </View>;
   }
   
   _onTouch() {
      this.setState({touched: true});
   }
   
   _onMove(evt, gestureState) {
      this.setState({degrees: this.state.degreeOffset + (this.
         props.horizontal ? gestureState.dx : -gestureState.dy)});
   }
   
   _onTouchSucceeded() {
      this.setState({
         touched: false,
         degreeOffset: this.state.degrees
      });
   }
   
   _onTouchFailed() {
      this.setState({touched: false});
   }
   
   _getBackgroundColor() {
      return ((StaticUtils.color(this.styles.container[0][1].backgroundColor ||
         styles.knob._container.backgroundColor) & 0xFFFFFF00) | (this.state.
            touched ? StaticUtils.round(this.styles.$activeOpacity * 255, 0) :
               0xFF)) >>> 0;
   }
}
