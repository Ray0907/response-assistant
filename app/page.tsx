// app/page.tsx
"use client";

import { useState, useEffect } from "react";

interface ResponseType {
  name: string;
}

export default function ResponseAssistant() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Start with a default value
  const [mounted, setMounted] = useState(false);
  const [apiType, setApiType] = useState("openai");
  const [mbtiSelections, setMbtiSelections] = useState({
    mind: "E",
    energy: "S",
    nature: "T",
    tactics: "J",
  });
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState("");
  const [responseTypes, setResponseTypes] = useState<ResponseType[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    // Fetch response types on component mount
    fetch("/api/response/types")
      .then((res) => res.json())
      .then((types) => {
        setResponseTypes(types);
        if (types.length > 0) {
          setSelectedType(types[0].name);
        }
      });
    const darkModePreference =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(darkModePreference);
    setMounted(true);

    // Update localStorage when theme changes
    if (darkModePreference) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Prevent hydration mismatch by not rendering the button until mounted
  if (!mounted) {
    return null; // or return a placeholder with the same dimensions
  }

  const getMBTIType = () => {
    return `${mbtiSelections.mind}${mbtiSelections.energy}${mbtiSelections.nature}${mbtiSelections.tactics}`;
  };

  const getThemeClasses = {
    background: "bg-gray-100 dark:bg-slate-800",
    container:
      "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600",
    text: "text-gray-800 dark:text-gray-100",
    input:
      "bg-gray-50 dark:bg-slate-600 border-gray-300 dark:border-slate-500 text-gray-800 dark:text-gray-100",
    button:
      "bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-500",
    secondaryText: "text-gray-600 dark:text-gray-400",
  };

  const generateResponse = async () => {
    if (!apiKey) {
      setError(
        `Please enter your ${
          apiType === "openai" ? "OpenAI" : "Antropic"
        } API key`
      );
      return;
    }

    if (!input) {
      setError("Please enter a message");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResponse("");

      const res = await fetch("/api/response/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          type: selectedType,
          apiKey,
          apiType,
          mbti: getMBTIType(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate response");
      }

      setResponse(data.response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${getThemeClasses.background} transition-colors duration-200`}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        <h1
          className={`text-3xl font-bold mb-8 text-center ${getThemeClasses.text}`}
        >
          AI Response Assistant
        </h1>

        <div className="bg-slate-700 rounded-lg shadow-xl p-6 border border-slate-600">
          {/* API Selection */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Select AI Model
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-300 hover:text-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="apiType"
                  value="openai"
                  checked={apiType === "openai"}
                  onChange={(e) => setApiType(e.target.value)}
                  className="mr-2 accent-cyan-400"
                />
                OpenAI
              </label>
              <label className="flex items-center text-gray-300 hover:text-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="apiType"
                  value="antropic"
                  checked={apiType === "antropic"}
                  onChange={(e) => setApiType(e.target.value)}
                  className="mr-2 accent-cyan-400"
                />
                Antropic
              </label>
            </div>
          </div>

          {/* MBTI Selection */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              MBTI Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={mbtiSelections.mind}
                onChange={(e) =>
                  setMbtiSelections({ ...mbtiSelections, mind: e.target.value })
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200"
              >
                <option value="E">Extrovert (E)</option>
                <option value="I">Introvert (I)</option>
              </select>

              <select
                value={mbtiSelections.energy}
                onChange={(e) =>
                  setMbtiSelections({
                    ...mbtiSelections,
                    energy: e.target.value,
                  })
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200"
              >
                <option value="S">Sensing (S)</option>
                <option value="N">Intuition (N)</option>
              </select>

              <select
                value={mbtiSelections.nature}
                onChange={(e) =>
                  setMbtiSelections({
                    ...mbtiSelections,
                    nature: e.target.value,
                  })
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200"
              >
                <option value="T">Thinking (T)</option>
                <option value="F">Feeling (F)</option>
              </select>

              <select
                value={mbtiSelections.tactics}
                onChange={(e) =>
                  setMbtiSelections({
                    ...mbtiSelections,
                    tactics: e.target.value,
                  })
                }
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200"
              >
                <option value="J">Judging (J)</option>
                <option value="P">Perceiving (P)</option>
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Select MBTI preferences to customize response style
            </p>
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              {apiType === "openai" ? "OpenAI API Key" : "Claude API Key"}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100 placeholder-gray-400"
              placeholder="Enter your API key"
            />
            <p className="text-xs text-gray-400 mt-1">
              Your API key is securely used only for generating responses
            </p>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Your Message
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100 placeholder-gray-400"
              rows={4}
              placeholder="Enter your message here..."
            />
          </div>

          {/* Response Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Response Persona
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-200"
            >
              {responseTypes.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateResponse}
            className="w-full bg-cyan-600 text-gray-100 py-2 px-4 rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed disabled:text-gray-400"
            disabled={loading}
          >
            Generate Response
          </button>

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-300 text-center font-medium">
              {error}
            </div>
          )}

          {/* Response Display */}
          <div className="mt-6">
            <label className="block text-gray-200 text-sm font-bold mb-2">
              Generated Response
            </label>
            <div className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg min-h-[100px] whitespace-pre-wrap text-gray-100">
              {response}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
