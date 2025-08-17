// Test script to verify API endpoints
const BASE_URL = "http://localhost:5000/api/v1";

async function testAPI() {
  try {
    console.log("🧪 Testing Fur-Bari Backend API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
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
