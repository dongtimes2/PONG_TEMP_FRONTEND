const urlCopier = async (url) => {
  await navigator.clipboard.writeText(url);
};

export default urlCopier;
