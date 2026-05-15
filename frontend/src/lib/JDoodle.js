const API_URL = "https://intervuex-sou7.onrender.com/api/code/execute";

export default async function executeCode(language, code) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        language,
        code,
      }),
    });

    return await response.json();

  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}