import axios from "axios";

export async function forward(targetUrl, req) {
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      params: req.query,
      data: req.body,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
    });

    return { statusCode: response.status, body: response.data };
  } catch (error) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        body: error.response.data,
      };
    }

    return {
      statusCode: 503,
      body: {
        error: "Service unavailable",
        message: error.message,
      },
    };
  }
}
