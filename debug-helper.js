// DEBUG HELPER FOR CONSOLE
// Copy-paste script ini ke Browser Console untuk debug API errors

console.log("🔧 PawTime Debug Helper Loaded");

// 1. Check localStorage data
console.log("\n📦 LocalStorage Data:");
console.log("Token:", localStorage.getItem("token")?.substring(0, 30) + "...");
console.log("User:", JSON.parse(localStorage.getItem("user") || "{}"));

// 2. Test API Endpoints
const testEndpoints = async () => {
  const token = localStorage.getItem("token");
  const BASE_URL = "https://pawtime-backend-production.up.railway.app";
  
  const endpoints = [
    "/api/bookings/history",
    "/api/bookings/walker/active",
    "/api/users/me"
  ];
  
  console.log("\n🧪 Testing API Endpoints:");
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(BASE_URL + endpoint, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log(`\n✅ ${endpoint}`);
      console.log(`Status: ${response.status}`);
      
      const data = await response.json();
      console.log("Response:", data);
      
    } catch (error) {
      console.error(`\n❌ ${endpoint}`);
      console.error("Error:", error.message);
    }
  }
};

// 3. Run tests
console.log("\n🚀 Running endpoint tests...");
testEndpoints();
