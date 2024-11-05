const checkImage = (url: string) => {
  var image = new Image();
  image.onload = function () {
    if (this.width > 0) {
      console.log("image exists");
    }
  };
  image.onerror = function () {
    console.log("image doesn't exist");
  };
  image.src = url;
};
