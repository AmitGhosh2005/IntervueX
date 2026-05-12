import fetch from "node-fetch";
import { ENV } from "../lib/env.js";

const JDOODLE_API = "https://api.jdoodle.com/v1/execute";

const LANGUAGE_CONFIG = {
  javascript: {
    language: "nodejs",
    versionIndex: "4",
  },

  python: {
    language: "python3",
    versionIndex: "4",
  },

  java: {
    language: "java",
    versionIndex: "4",
  },
};

export const executeCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const config = LANGUAGE_CONFIG[language];

    if (!config) {
      return res.status(400).json({
        success: false,
        error: "Unsupported language",
      });
    }

    const response = await fetch(JDOODLE_API, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        clientId: ENV.VITE_JDOODLE_CLIENT_ID,
        clientSecret: ENV.VITE_JDOODLE_CLIENT_SECRET,

        script: code,

        language: config.language,
        versionIndex: config.versionIndex,
      }),
    });

    const data = await response.json();
    console.log(data);

    const output = data.output || "";

    const hasError =
      output.toLowerCase().includes("error") ||
      output.toLowerCase().includes("exception");

    if (hasError) {
      return res.json({
        success: false,
        error: output,
      });
    }

    return res.json({
      success: true,
      output,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};