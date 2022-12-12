import NodeGeocoder from "node-geocoder";
import dotenv from "dotenv";

dotenv.config({
  path: "./config/config.env",
});
const { GEOCODER_PROVIDER, GEOCODER_API_KEY } = process.env;

const options = {
  provider: GEOCODER_PROVIDER,
  apiKey: GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export default geocoder;
