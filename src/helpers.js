const fetch = require("node-fetch");

async function addressVerify(zipcode, houseNumber) {
  const VERIFY_ADDRESS_API_KEY = process.env.VERIFY_ADDRESS_API_KEY;
  try {
    const response = await fetch(
      `https://json.api-postcode.nl/?postcode=${zipcode}&number=${houseNumber}`,
      {
        headers: { token: VERIFY_ADDRESS_API_KEY },
      }
    );

    const data = await response.json();

    if (data.error) {
      return { error: data.error };
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  addressVerify,
};
