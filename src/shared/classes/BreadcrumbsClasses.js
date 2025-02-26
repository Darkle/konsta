export const BreadcrumbsClasses = (props) => {
  const { fontSizeIos, fontSizeMaterial } = props;
  return {
    base: {
      common: `flex items-center justify-start overflow-auto whitespace-nowrap py-1 px-0 space-x-3`,
      ios: fontSizeIos,
      material: fontSizeMaterial,
    },
  };
};
