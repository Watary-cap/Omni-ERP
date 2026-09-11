module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run dev -- --host 127.0.0.1",
      startServerReadyPattern: "Local:",
      url: ["http://127.0.0.1:5173/login"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
