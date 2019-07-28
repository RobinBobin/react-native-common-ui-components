import React from "react";
import {
   findNodeHandle,
   View
} from "react-native";
import { StaticUtils } from "simple-common-utils";
import ProgressBar from "./ProgressBar";

/**
 * To be used with TouchContainer.
 */
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
         onLayout={this._onLayout.bind(this)}>
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
   
   async _onLayout() {
      try {
         let {x, y, width, height} = await new Promise((rslv, rjct) => {
            const handle = findNodeHandle(this.props.refData.ref.current);
            
            const success = (x, y, width, height) => {
               rslv({x, y, width, height});
            };
            
            this._ref.current.measureLayout(handle, success, rjct);
         });
         
         x += this.props.refData.marginLeft || 0;
         y += this.props.refData.marginTop || 0;
         
         const slider = {
            x0: x,
            y0: y,
            x1: x + width,
            y1: y + height
         };
         
         const min = slider[`${this._row ? "x" : "y"}0`] + this.props.thumbDiameter / 2;
         
         const max = min + (this._row ? width : height) - this.props.thumbDiameter;
         
         const progress = {
            min,
            max,
            range: max - min,
            minValueCoord: this._reverse ? max : min
         };
         
         this._layout = {
            slider,
            progress
         };
         
         this.forceUpdate();
      } catch (e) {
         console.log(e.message);
      }
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
         [offsetName]: this._layout ? this._layout.progress.range * this.state.progress : 0,
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
   
   /**
    * Invoked by TouchContainer.
    */
   _shouldHandleTouch(event, changedTouchIndex) {
      const pageX = event.nativeEvent.changedTouches[changedTouchIndex].pageX;
      const pageY = event.nativeEvent.changedTouches[changedTouchIndex].pageY;
      
      return pageX >= this._layout.slider.x0 && pageX <= this._layout.slider.x1 && pageY >= this._layout.slider.y0 && pageY <= this._layout.slider.y1;
   }
   
   _updateProgress({pageX, pageY}) {
      const coord = StaticUtils.ensureBounds(this._row ? pageX : pageY, this._layout.progress.min, this._layout.progress.max);
      
      this._setProgress(Math.abs(coord - this._layout.progress.minValueCoord) / this._layout.progress.range);
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
