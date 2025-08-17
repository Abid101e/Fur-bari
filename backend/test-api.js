// Test script to verify API endpoints
import http from "http";

const BASE_URL = "http://localhost:5000";

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function testAPI() {
  try {
    console.log("🧪 Testing Fur-Bari Backend API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await makeRequest("/health");
    const healthData = await healthResponse.json();
    console.log("✅ Health:", healthData);

    // Test auth endpoints
    console.log("\n2. Testing auth endpoints structure...");

    // Test register endpoint (expect validation error)
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    console.log("📝 Register endpoint status:", registerResponse.status);

    // Test login endpoint (expect validation error)
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    console.log("🔐 Login endpoint status:", loginResponse.status);

    console.log("\n✅ All endpoint tests completed!");
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

testAPI();
