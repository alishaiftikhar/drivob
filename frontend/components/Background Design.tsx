import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, Animated, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Color';

const { width, height } = Dimensions.get('window');
const circleSize = 150;

type BackgroundDesignProps = {
  children?: React.ReactNode;
  text?: string;
  imageSource?: any;
};

const BackgroundDesign = (props: BackgroundDesignProps) => {
  const { children, text, imageSource } = props;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, Colors.background]} style={styles.gradient}>
        <Animated.View style={[styles.circleContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.circle}>
            {imageSource && <Image source={imageSource} style={styles.image} />}
            {!imageSource && text && <Text style={styles.circleText}>{text}</Text>}
          </View>
        </Animated.View>
        {children}
      </LinearGradient>
    </View>
  );
};

export default BackgroundDesign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});
