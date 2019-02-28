import React from "react";
import {
   View,
   Text,
   PanResponder
} from "react-native";
import { autobind } from "core-decorators";
import {
   styles,
   combineStyles
} from "react-native-common-ui-components/js/styles";
import { StaticUtils } from "react-native-common-utils";

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
         onStartShouldSetPanResponder: this._shouldSet,
         onStartShouldSetPanResponderCapture: this._shouldSet,
         onMoveShouldSetPanResponder: this._shouldSet,
         onMoveShouldSetPanResponderCapture: this._shouldSet,
         onPanResponderGrant: this._onTouch,
         onPanResponderMove: this._onMove,
         onPanResponderRelease: this._onTouchSucceeded,
         onPanResponderTerminate: this._onTouchFailed
      });
   }
   
   render() {
      const stl = combineStyles(styles.knob, this.props.disabled ? styles.knobDisabled : null, this.props.style);
      
      [
         ["container", "$radius"],
         ["marker", "$markerRadius"]
      ].forEach(data => {
         const borderRadius = stl[data[1]];
         
         stl[data[0]].push({
            width: borderRadius * 2,
            height: borderRadius * 2,
            borderRadius
         });
      });
      
      const container = {
         opacity: this.state.touched ? stl.$activeOpacity : undefined
      };
      
      this._rawValueToBackgroundColor(container);
      
      stl.container.push(container);
      
      const radiusDiff = stl.$radius - stl.$markerRadius;
      
      const angle = StaticUtils.deg2Rad(this.props.minAngle - this.
         angleToValueCoeff * (this.state.rawValue - this.props.minValue));
      
      stl.marker.push({
         left: radiusDiff + Math.cos(angle) * stl.$markerDistance,
         top: radiusDiff - Math.sin(angle) * stl.$markerDistance
      });
      
      return <View
         style={stl.container}
         onLayout={this.props.onLayout}
         { ...this.panResponder.panHandlers }>
         <View style={stl.marker} />
         <Text style={stl.valueText}>{this.state.value}</Text>
         { this.props.uom ? <Text style={stl.uomText}>
            {this.props.uom}</Text> : null }
      </View>;
   }
   
   _shouldSet() {
      return !this.props.disabled
   }
   
   _onTouch() {
      this.setState({touched: true});
   }
   
   _onMove(evt, gestureState) {
      const rawValue = StaticUtils.ensureBounds(this.state.rawValueOffset +
         (this.props.horizontal ? gestureState.dx : -gestureState.dy) / this.props.distanceToValueCoeff, this.props.minValue, this.props.maxValue);
      
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
   
   _rawValueToBackgroundColor(container) {
      if (this.props.rawValueToBackgroundColor !== undefined) {
         let color;
         
         if (typeof this.props.rawValueToBackgroundColor == "function") {
            color = this.props.rawValueToBackgroundColor(this.state.rawValue);
         } else {
            switch (this.props.rawValueToBackgroundColor) {
               case "greenred": {
                  const value = 255 / (this.props.maxValue - this.props.minValue) * (this.state.rawValue - this.props.minValue);
                 
                  color = ((StaticUtils.round(value, 0) << 24) | (StaticUtils.round(255 - value, 0) << 16) | 0xFF) >>> 0;
                  
                  break;
               }
            }
         }
         
         container.backgroundColor = color;
      }
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
