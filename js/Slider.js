import React from "react";
import { View } from "react-native";
import { autobind } from "core-decorators";
import { StaticUtils } from "simple-common-utils";
import ProgressBar from "./ProgressBar";

@autobind
export default class Slider extends React.PureComponent {
   static defaultProps = {
      sliderFlex: 0,
      progressBarFlex: 0,
      flexDirection: "row",
      size: 4,
      borderRadius: 0,
      borderThickness: 0,
      progressColor: 0x009688FF,
      remainingColor: "darkgray",
      minimumValue: 0,
      maximumValue: 1,
      initialValue: 0.5,
      valueDecimals: 1,
      thumbDiameter: 20,
      thumbColor: 0x009688FF
   };
   
   static propTypes = {
      initialValue: props => props.initialValue < props.minimumValue || props.initialValue > props.maximumValue ? new Error("'initialValue' supplied to 'Slider' is expected to be in the range 'minimumValue'..'maximumValue' inclusive.") : undefined
   };
   
   constructor(props) {
      super(props);
      
      this.props.setInstance(this);
      
      this.state = {
         progress: (this.props.initialValue - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue)
      }
      
      this._ref = React.createRef();
      this._row = this.props.flexDirection.indexOf("row") != -1;
      this._reverse = this.props.flexDirection.indexOf("reverse") != -1;
      
      this._value = StaticUtils.round(this.props.minimumValue + (this.props.maximumValue - this.props.minimumValue) * this.state.progress, this.props.valueDecimals);
   }
   
   componentWillUnmount() {
      this.props.setInstance(null);
   }
   
   render() {
      const stls = this._createStyles();
      
      return <View
         style={stls.container}
         ref={this._ref}
         onLayout={this._onLayout}>
         <ProgressBar
            flex={this.props.progressBarFlex}
            flexDirection={this.props.flexDirection}
            size={this.props.size}
            borderRadius={this.props.borderRadius}
            borderColor={this.props.borderColor}
            borderThickness={this.props.borderThickness}
            progress={this.state.progress}
            progressColor={this.props.progressColor}
            remainingColor={this.props.remainingColor} />
         <View style={stls.thumb} />
      </View>;
   }
   
   _onLayout() {
      this._ref.current.measureInWindow((x, y, width, height) => {
         this._layout = {
            x0: x,
            y0: y,
            range: this._row ? width: height,
            x1: x + width,
            y1: y + height
         };
         
         this.forceUpdate();
      });
   }
   
   _createStyles() {
      const container = {
         flex: this.props.sliderFlex,
         justifyContent: "center",
         alignItems: "center",
         [this._row ? "height" : "width"]: this.props.thumbDiameter,
         [`padding${this._row ? "Horizontal" : "Vertical"}`]: this.props.thumbDiameter / 2
      };
      
      const offsetName = this._row ? this._reverse ? "right" : "left" : this._reverse ? "bottom" : "top";
      
      const thumb = {
         position: "absolute",
         width: this.props.thumbDiameter,
         height: this.props.thumbDiameter,
         [offsetName]: (this._layout ? this._layout.range * this.state.progress : 0) - this.props.thumbDiameter * this.state.progress,
         borderRadius: this.props.thumbDiameter / 2,
         
         backgroundColor: this.props.thumbColor
      };
      
      return {
         container,
         thumb
      };
   }
   
   _setProgress(progress, panResponderEnd) {
      this.setState({progress});
      
      const value = StaticUtils.round(this.props.minimumValue + (this.props.maximumValue - this.props.minimumValue) * progress, this.props.valueDecimals);
      
      if (value != this._value) {
         this._value = value;
         
         if (this.props.onValueChanged) {
            this.props.onValueChanged(value, panResponderEnd);
         }
      }
   }
   
   _shouldHandleTouch(event, changedTouchIndex) {
      const pageX = event.nativeEvent.changedTouches[changedTouchIndex].pageX;
      const pageY = event.nativeEvent.changedTouches[changedTouchIndex].pageY;
      
      return pageX >= this._layout.x0 && pageX <= this._layout.x1 && pageY >= this._layout.y0 && pageY <= this._layout.y1;
   }
   
   _updateProgress({pageX, pageY}) {
      const xOrY = this._row ? "x" : "y";
      
      const coord = StaticUtils.ensureBounds(this._row ? pageX : pageY, this._layout[`${xOrY}0`], this._layout[`${xOrY}1`]);
      
      this._setProgress(Math.abs(coord - this._layout[`${xOrY}${+this._reverse}`]) / this._layout.range);
   }
   
   _onPanResponderStart(event) {
      this._updateProgress(event.nativeEvent);
   }
   
   _onPanResponderMove(event, changedTouchIndex) {
      this._updateProgress(event.nativeEvent.changedTouches[changedTouchIndex]);
   }
   
   _onPanResponderEnd() {
      if (this.props.resetToInitialValue) {
         this._setProgress((this.props.initialValue - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue), true);
      }
   }
}
