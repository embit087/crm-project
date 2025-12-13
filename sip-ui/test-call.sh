#!/bin/bash

# Voximplant API Credentials from .env.local
ACCOUNT_ID="9968941"
API_KEY="7d6066d1-ec84-4a23-bebe-37deba8c26c9"
API_URL="https://api.voximplant.com/platform_api"
APP_ID="11010622"

# Test phone number (replace with a real number)
PHONE_NUMBER="${1:-15551234567}"  # Default test number, or pass as argument

echo "Testing Voximplant API call initiation..."
echo "Account ID: $ACCOUNT_ID"
echo "API URL: $API_URL"
echo "Destination: $PHONE_NUMBER"
echo ""

# First, let's try to get account info to verify credentials
echo "=== Testing API Authentication ==="
curl -X POST "$API_URL/GetAccountInfo" \
  -u "$ACCOUNT_ID:$API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "account_id=$ACCOUNT_ID" \
  -v

echo ""
echo ""
echo "=== Testing Call Initiation (StartScenarios) ==="
# Note: You'll need a valid rule_id/scenario_id for this to work
# This is a template - you may need to adjust parameters based on your Voximplant setup
curl -X POST "$API_URL/StartScenarios" \
  -u "$ACCOUNT_ID:$API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "account_id=$ACCOUNT_ID" \
  -d "rule_id=YOUR_RULE_ID" \
  -d "script_custom_data={\"phone_number\":\"$PHONE_NUMBER\"}" \
  -v

echo ""
echo ""
echo "=== Alternative: StartCall (if available) ==="
curl -X POST "$API_URL/StartCall" \
  -u "$ACCOUNT_ID:$API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "account_id=$ACCOUNT_ID" \
  -d "application_id=$APP_ID" \
  -d "phone_number=$PHONE_NUMBER" \
  -v

