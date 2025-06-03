import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dydz0lw6e", // Replace with your Cloudinary name
  },
});

export default cld;
