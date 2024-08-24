const containerVariantDropdown = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2,
      delaychildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const containerVariantNav = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2,
      delaychildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const childVariantNav = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const containerVariant = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.8,
      staggerChildren: 0.4,
      delayChildren: 1.4,
    },
  },
};

const childVariant = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.7,
    },
  },
};

export {
  childVariant,
  containerVariant,
  childVariantNav,
  containerVariantNav,
  containerVariantDropdown,
};
