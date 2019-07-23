import React from "react";
import {
   View,
   PanResponder
} from "react-native";
import { StaticUtils } from "react-native-common-utils";

export default class TouchContainer extends React.PureComponent {
   static defaultProps = {
      moveDecimals: 1
   };
   
   constructor(props) {
      super(props);
      
      this._children = new Map();
      this._previous = new Map();
      
      this._panResponder = PanResponder.create([
         "onStartShouldSetPanResponder",
         "onStartShouldSetPanResponderCapture",
         "onMoveShouldSetPanResponder",
         "onMoveShouldSetPanResponderCapture",
         "onPanResponderGrant",
         "onPanResponderStart",
         "onPanResponderMove",
         "onPanResponderEnd",
         "onPanResponderRelease",
         "onPanResponderReject",
         "onPanResponderTerminate",
         "onPanResponderTerminationRequest",
         "onShouldBlockNativeResponder"
      ].reduce((p, c) => {
         p[c] = this[`_${c}`];
         
         if (p[c]) {
            p[c] = p[c].bind(this);
         }
         
         return p;
      }, {}));
   }
   
   render() {
      return <View
         style={this.props.style}
         { ...this._panResponder.panHandlers }>
         { React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
               setInstance: this._setChildInstance.bind(this, index)
            })) }
      </View>;
   }
   
   _safeInvoke(child, handlerName, ...args) {
      if (child.instance[handlerName]) {
         child.instance[handlerName](...args);
      }
   }
   
   _onStartShouldSetPanResponder() {
      return true;
   }
   
   _onStartShouldSetPanResponderCapture() {
      return true;
   }
   
   _onMoveShouldSetPanResponder() {
      return true;
   }
   
   _onMoveShouldSetPanResponderCapture() {
      return true;
   }
   
   _onPanResponderGrant(event, gestureState) {
      this._invokeChildHandler("_onPanResponderGrant", event, gestureState, {
         iterateAllChildren: true
      });
   }
   
   _onPanResponderStart(event, gestureState) {
      for (let child of this._children.values()) {
         if (child.instance._shouldHandleTouch(event, 0, gestureState) && (!child.touchIdentifiers.length || (child._areMultipleTouchesAllowed && child._areMultipleTouchesAllowed(event, 0, gestureState))))
         {
            child.touchIdentifiers.push(event.nativeEvent.identifier);
            
            this._safeInvoke(child, "_onPanResponderStart", event, 0, gestureState);
            
            this._previous.set(event.nativeEvent.identifier, {
               pageX: event.nativeEvent.pageX,
               pageY: event.nativeEvent.pageY,
            });
         }
      }
   }
   
   _onPanResponderMove(event, gestureState) {
      this._invokeChildHandler("_onPanResponderMove", event, gestureState);
   }
   
   _onPanResponderEnd(event, gestureState) {
      this._invokeChildHandler("_onPanResponderEnd", event, gestureState, {
         callback: (child, touchIdentifierIndex) => child.touchIdentifiers.splice(touchIdentifierIndex, 1)
      });
   }
   
   _onPanResponderRelease(event, gestureState) {
      this._invokeChildHandler("_onPanResponderRelease", event, gestureState, {
         iterateAllChildren: true
      });
   }
   
   _setChildInstance(index, instance) {
      if (!instance) {
         this._children.delete(index);
      } else {
         this._children.set(index, {
            instance,
            touchIdentifiers: []
         });
      }
   }
   
   _invokeChildHandler(handlerName, event, gestureState, options = {}) {
      for (let child of this._children.values()) {
         if (options.iterateAllChildren) {
            this._safeInvoke(child, handlerName, event, gestureState);
         } else {
            for (let i = 0; i < event.nativeEvent.changedTouches.length; i++ ) {
               const changedTouch = event.nativeEvent.changedTouches[i];
               
               const touchIdentifierIndex = child.touchIdentifiers.indexOf(changedTouch.identifier);
            
               if (touchIdentifierIndex != -1) {
                  let skip = false;
                  
                  if (handlerName == "_onPanResponderMove") {
                     const previous = this._previous.get(changedTouch.identifier);
                     
                     const deltaX = StaticUtils.round(changedTouch.pageX - previous.pageX, this.props.moveDecimals);
                     
                     const deltaY = StaticUtils.round(changedTouch.pageY - previous.pageY, this.props.moveDecimals);
                     
                     skip = !(deltaX || deltaY);
                     
                     if (!skip) {
                        previous.pageX = changedTouch.pageX;
                        previous.pageY = changedTouch.pageY;
                     }
                  }
                  
                  if (!skip) {
                     this._safeInvoke(child, handlerName, event, i, gestureState);
                     
                     if (options.callback) {
                        options.callback(child, touchIdentifierIndex);
                     }
                  }
               }
            }
         }
      }
   }
}
