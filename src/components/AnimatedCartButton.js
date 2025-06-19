import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '../constant/Styles';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedCartButton = ({ count = 0, onPress, label = 'View Cart' }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  // Animate button press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  // Animate badge when count changes
  useEffect(() => {
    if (prevCount.current !== count) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 30,
          bounciness: 10,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]).start();
      prevCount.current = count;
    }
  }, [count, badgeScale]);

  return (
    <Animated.View style={[styles.animatedWrapper, { transform: [{ scale: scaleAnim }] }]}> 
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ borderRadius: 30, overflow: 'hidden' }}
      >
        <AnimatedLinearGradient
          colors={[Colors.red, Colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <View style={styles.contentRow}>
            <Ionicons name="cart-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>{label}</Text>
            <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }] }]}> 
              <Text style={styles.badgeText}>{count}</Text>
            </Animated.View>
          </View>
        </AnimatedLinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    left: 30,
    right: 30,
    minWidth: 180,
    zIndex: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 180,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    fontFamily: Fonts.InterBold,
  },
  badge: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
});

export default AnimatedCartButton; 