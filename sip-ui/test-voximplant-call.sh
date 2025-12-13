#!/bin/bash

# Voximplant API Credentials from .env.local
ACCOUNT_ID="9968941"
API_KEY="7d6066d1-ec84-4a23-bebe-37deba8c26c9"
API_URL="https://api.voximplant.com/platform_api"
APP_ID="11010622"
APPLICATION_NAME="call.ne1432hz.n2.voximplant.com"

# Test phone number (replace with a real number)
PHONE_NUMBER="${1:-15551234567}"  # Default test number, or pass as argument

echo "=========================================="
echo "Voximplant API Call Test"
echo "=========================================="
echo "Account ID: $ACCOUNT_ID"
echo "Application ID: $APP_ID"
echo "Application Name: $APPLICATION_NAME"
echo "Destination: $PHONE_NUMBER"
echo ""

# Test 1: Verify account info
echo "=== Test 1: Account Info ==="
curl -s -X POST "${API_URL}/GetAccountInfo?account_id=${ACCOUNT_ID}&api_key=${API_KEY}" \
  -H "Content-Type: application/x-www-form-urlencoded" | python3 -m json.tool | grep -E "(account_name|balance|active)" | head -5
echo ""

# Test 2: Get application info
echo "=== Test 2: Application Info ==="
curl -s -X POST "${API_URL}/GetApplications?account_id=${ACCOUNT_ID}&api_key=${API_KEY}" \
  -H "Content-Type: application/x-www-form-urlencoded" | python3 -m json.tool | grep -A 5 -B 5 "$APP_ID" | head -20
echo ""

# Test 3: Get rules/scenarios for the application
echo "=== Test 3: Get Rules ==="
curl -s -X POST "${API_URL}/GetRules?account_id=${ACCOUNT_ID}&api_key=${API_KEY}&application_id=${APP_ID}" \
  -H "Content-Type: application/x-www-form-urlencoded" | python3 -m json.tool | head -50
echo ""

# Test 4: Try StartScenarios (requires rule_id)
echo "=== Test 4: StartScenarios (need rule_id) ==="
echo "Note: This requires a valid rule_id from Test 3"
echo "Example command (replace RULE_ID):"
echo "curl -X POST \"${API_URL}/StartScenarios?account_id=${ACCOUNT_ID}&api_key=${API_KEY}\" \\"
echo "  -H \"Content-Type: application/x-www-form-urlencoded\" \\"
echo "  -d \"rule_id=RULE_ID\" \\"
echo "  -d \"script_custom_data={\\\"phone_number\\\":\\\"${PHONE_NUMBER}\\\"}\""
echo ""

# Test 5: Check SIP credentials
echo "=== Test 5: SIP Registration Info ==="
echo "SIP Proxy: sip1.yohalabs.com:5003"
echo "SIP Username: 5511993"
echo "SIP Registration ID: 9713"
echo ""
echo "To test SIP directly, you would need a SIP client like:"
echo "  - sip:5511993@sip1.yohalabs.com:5003"
echo ""

echo "=========================================="
echo "Next Steps:"
echo "1. Run this script to see available rules"
echo "2. Use a rule_id from Test 3 to make a call"
echo "3. Or use the Web SDK (which is what the app uses)"
echo "=========================================="

