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
      $activeOpacity: styles.activeOpacity
   };
   
   styles.knob.container = {
      ...styles.centerCenter,
      backgroundColor: "lightgreen",
   };
   
   styles.knob.marker = {
      position: "absolute",
      backgroundColor: "black"
   };
   
   styles.knob.valueText = {
      fontSize: fontSize(font.largeSteps),
      color: styles.textColor
   };
   
   styles.knob.uomText = {
      fontSize: fontSize(font.mediumSteps),
      color: styles.textColor
   };
}

export {
   styles,
   font,
   fontSize,
   create,
   build
};

export default indexObjectWithClassName;
