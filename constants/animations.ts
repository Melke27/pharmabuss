// Animation configurations

export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease' as const,
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
    spring: 'spring' as const,
  },
};

export const AnimationPresets = {
  fadeIn: {
    opacity: [0, 1],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  fadeOut: {
    opacity: [1, 0],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeIn,
  },
  slideInRight: {
    transform: [{ translateX: [100, 0] }],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  slideInLeft: {
    transform: [{ translateX: [-100, 0] }],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  slideInUp: {
    transform: [{ translateY: [100, 0] }],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  slideInDown: {
    transform: [{ translateY: [-100, 0] }],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  scaleIn: {
    scale: [0.9, 1],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeOut,
  },
  scaleOut: {
    scale: [1, 0.9],
    duration: Animations.duration.normal,
    easing: Animations.easing.easeIn,
  },
};
