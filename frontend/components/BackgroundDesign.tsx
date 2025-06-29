import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/Color'; // Make sure Colors.background is your desired color

const circleSize = 200;

type BackgroundDesignProps = {
  children?: React.ReactNode;
  text?: string;
  imageSource?: any;
  topOffset?: number;
};

const BackgroundDesign = ({
  children,
  text,
  imageSource,
  topOffset = 150,
}: BackgroundDesignProps) => {
  return (
    <View style={styles.container}>
      {/* Circle at the top */}
      <View style={[styles.circleContainer, { marginTop: topOffset }]}>
        <View style={styles.circle}>
          {imageSource && <Image source={imageSource} style={styles.image} />}
          {!imageSource && text && <Text style={styles.circleText}>{text}</Text>}
        </View>
      </View>

      {/* Child screen content */}
      <View style={styles.childArea}>
        {children}
      </View>
    </View>
  );
};

export default BackgroundDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // ✅ Background color used for entire screen
    alignItems: 'center',
  },
  circleContainer: {
    width: circleSize + 20,
    height: circleSize + 20,
    borderRadius: (circleSize + 20) / 2,
    borderWidth: 5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  circleText: {
    color: Colors.text,
    fontSize: 30,
    fontFamily:'serif',
    fontWeight: 900,
  },
  childArea: {
    flex: 1,
    width: '100%',
    paddingTop: 40,
    backgroundColor: Colors.background, // ✅ Same background below the circle
  },
});
