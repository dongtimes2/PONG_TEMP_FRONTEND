const controllerUrlGenerator = (userId) => {
  return window.location.origin + '/controller/' + userId;
};

export default controllerUrlGenerator;
