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
      min: {
         value: 0,
         angle: 270
      },
      max: {
         value: 100,
         angle: -90
      },
      decimals: 0,
      distanceToValueCoeff: 10
   };
   
   constructor(props) {
      super(props);
      
      this.state = {
         touched: false
      };
      
      this.state.rawValue = this.state.rawValueOffset =
         this.props.initialValue || this.props.min.value;
      
      this.state.value = this._normalize(this.state.rawValue);
      
      this.angleToValueCoeff = (Math.abs(this.props.min.angle) + Math.abs(
         this.props.max.angle)) / (this.props.max.value - this.props.min.value);
      
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
      
      const angle = StaticUtils.deg2Rad(this.props.min.angle - this.
         angleToValueCoeff * (this.state.rawValue - this.props.min.value));
      
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
            distanceToValueCoeff, this.props.min.value, this.props.max.value);
      
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
      return ((StaticUtils.color(this.styles.container[0][1].backgroundColor ||
         styles.knob._container.backgroundColor) & 0xFFFFFF00) | (this.state.
            touched ? StaticUtils.round(this.styles.$activeOpacity * 255, 0) :
               0xFF)) >>> 0;
   }
   
   _normalize(value) {
      let result = value;
      
      if (this.props.step) {
         const prev = this.props.min.value + parseInt((result - this.
            props.min.value) / this.props.step) * this.props.step;
         
         const next = prev + this.props.step;
         
         result = (result - prev) < (next - result) ? prev : next;
      }
      
      return StaticUtils.round(result, this.props.decimals, true);;
   }
}
