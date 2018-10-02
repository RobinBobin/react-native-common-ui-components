import indexObjectWithClassName, {
   styles,
   font,
   fontSize,
   create as createBase,
   build
} from "react-native-common-utils/js/styles";

function create() {
   createBase();
   
   styles.button = {
      container: {
         ...styles.centerCenter,
         height: styles.baseHeight,
         backgroundColor: 0x0099CBFF
      },
      text: {
         color: "white",
         fontSize: 20,
         textAlign: "center"
      }
   };
   
   styles.buttonDisabled = {
      container: {
         backgroundColor: styles.textColorDisabled
      }
   };

   styles.toggleButtons = {
      container: {
         flexDirection: "row",
         justifyContent: "center",
         paddingTop: styles.marginPadding * 0.5,
         paddingBottom: styles.marginPadding * 0.5
      },
      $button: {
         container: {
            inactive: {
               ...styles.centerCenter,
               paddingTop: styles.marginPadding * 0.5,
               paddingBottom: styles.marginPadding * 0.5,
               paddingLeft: styles.marginPadding,
               paddingRight: styles.marginPadding
            },
            active: {
               backgroundColor: styles.textColor
            }
         },
         label: {
            inactive: {
               color: styles.textColor,
               fontSize: 20,
               textAlign: "center"
            },
            active: {
               color: "white"
            }
         }
      }
   };
   
   styles.knob = {
      $radius: 50,
      $markerDistance: 35,
      $markerRadius: 4,
      $activeOpacity: styles.activeOpacity,
      container: {
         ...styles.centerCenter,
         backgroundColor: "lightgreen",
      },
      marker: {
         position: "absolute",
         backgroundColor: "black"
      },
      valueText: {
         fontSize: fontSize(font.largeSteps),
         color: styles.textColor
      },
      uomText: {
         fontSize: fontSize(font.mediumSteps),
         color: styles.textColor
      }
   };
   
   styles.knobDisabled = {
      container: {
         backgroundColor: styles.textColorDisabled,
      },
      marker: {
         backgroundColor: 0x8F8A8AFF
      }
   };
}

export function combineStyles(defaultStyle, defaultDisabledStyle, runtimeStyle) {
   const stl = {};
   
   for (let name of Object.keys(defaultStyle)) {
      const isVar = defaultStyle[name].constructor != Object;
      
      stl[name] = isVar ? defaultStyle[name] : [defaultStyle[name]];
      
      for (let i = 1; i < 3; i++) {
         if (arguments[i] && arguments[i][name]) {
            isVar ? stl[name] = arguments[i][name] : stl[name].push(arguments[i][name]);
         }
      }
   }
   
   return stl;
}

export {
   styles,
   font,
   fontSize,
   create,
   build
};

export default indexObjectWithClassName;
