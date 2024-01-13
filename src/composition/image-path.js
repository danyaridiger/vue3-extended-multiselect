export default function useImagePath() {

  const createImagePath = (image) => {
    const hasRequire = typeof require !== "undefined";
    if (hasRequire) {
      return require(`../assets/images/${image}`);
    } else {
      try {
        return new URL(`../assets/images/${image}`, import.meta.url).href;
      } catch(error) {
        throw new ReferenceError("import.meta.url is available in «esnext» libtype only");
      }
    }
  };

  return { createImagePath };
}