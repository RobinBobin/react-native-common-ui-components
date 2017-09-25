import React from "react";
import {
   View,
   Text,
   PanResponder
} from "react-native";
import { autobind } from "core-decorators";
import { styles } from "react-native-common-ui-components/js/styles";
import {
   StaticUtils,
   AlterStyles
} from "react-native-common-utils";

@autobind
export default class Knob extends React.Component {
   static defaultProps = {
      minValue: 0,
      maxValue: 100,
      minAngle: 270,
      maxAngle: -90,
      decimals: 0,
      distanceToValueCoeff: 10
   };
   
   constructor(props) {
      super(props);
      
      this.state = {
         touched: false
      };
      
      this.state.rawValue = this.state.rawValueOffset =
         this.props.initialValue || this.props.minValue;
      
      this.state.value = this._normalize(this.state.rawValue);
      
      this.angleToValueCoeff = (Math.abs(this.props.minAngle) + Math.abs(
         this.props.maxAngle)) / (this.props.maxValue - this.props.minValue);
      
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
      const radiusDiff = this.styles.$radius - this.styles.$markerRadius;
      
      const angle = StaticUtils.deg2Rad(this.props.minAngle - this.
         angleToValueCoeff * (this.state.rawValue - this.props.minValue));
      
      const container = [this.styles.container, {
         backgroundColor: this._getBackgroundColor()
      }];
      
      const marker = [this.styles.marker, {
         left: radiusDiff + Math.cos(angle) * this.styles.$markerDistance,
         top: radiusDiff - Math.sin(angle) * this.styles.$markerDistance
      }];
      
      return <View style={container} { ...this.panResponder.panHandlers }>
         <View style={marker} />
         <Text style={this.styles.valueText}>{this.state.value}</Text>
         { this.props.uom ? <Text style={this.styles.uomText}>
            {this.props.uom}</Text> : null }
      </View>;
   }
   
   _onTouch() {
      this.setState({touched: true});
   }
   
   _onMove(evt, gestureState) {
      const rawValue = StaticUtils.ensureBounds(this.state.rawValueOffset +
         (this.props.horizontal ? gestureState.dx : -gestureState.dy) / this.props.
            distanceToValueCoeff, this.props.minValue, this.props.maxValue);
      
      const value = this._normalize(rawValue);
      
      if (this.props.onValueChange) {
         if (this._normalize(this.state.rawValue) != value) {
            this.props.onValueChange(value);
         }
      }
      
      this.setState({rawValue, value});
   }
   
   _onTouchSucceeded() {
      this.setState({
         touched: false,
         rawValueOffset: this.state.rawValue
      });
   }
   
   _onTouchFailed() {
      this.setState({touched: false});
   }
   
   _getBackgroundColor() {
      let color;
      
      if (!this.props.rawValueToBackgroundColor) {
         color = StaticUtils.color(this.styles.container[0][1].
            backgroundColor || styles.knob._container.backgroundColor);
      } else if (typeof this.props.rawValueToBackgroundColor == "function") {
         color = this.props.rawValueToBackgroundColor(this.state.rawValue);
      } else {
         switch (this.props.rawValueToBackgroundColor) {
            case "greenred": {
               const value = 255 / (this.props.maxValue - this.props.
                  minValue) * (this.state.rawValue - this.props.minValue);
               
               color = ((StaticUtils.round(value, 0) << 24) |
                  (StaticUtils.round(255 - value, 0) << 16) | 0xFF) >>> 0;
               
               break;
            }
         }
      }
      
      if (this.state.touched) {
         color = ((color & 0xFFFFFF00) | StaticUtils.round(
            this.styles.$activeOpacity * 255, 0)) >>> 0;
      }
      
      return color;
   }
   
   _normalize(value) {
      let result = value;
      
      if (this.props.step) {
         const prev = this.props.minValue + parseInt((result - this.
            props.minValue) / this.props.step) * this.props.step;
         
         const next = prev + this.props.step;
         
         result = (result - prev) < (next - result) ? prev : next;
      }
      
      return StaticUtils.round(result, this.props.decimals, true);
   }
}
