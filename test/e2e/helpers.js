expect.extend({
  toBeAround(received, v, margin = 1) {
    const min = v - margin;
    const max = v + margin;
    const pass = received >= min && received <= max;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${min} - ${max}`,
        pass,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${min} - ${max}`,
        pass,
      };
    }
  },
});