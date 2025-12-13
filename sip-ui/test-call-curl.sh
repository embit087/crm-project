#!/bin/bash

# Simple curl command to test making a call via Voximplant API
# Usage: ./test-call-curl.sh [phone_number]
# Example: ./test-call-curl.sh 15551234567

PHONE_NUMBER="${1:-15551234567}"

echo "Making call to: $PHONE_NUMBER"
echo ""

curl -X POST "https://api.voximplant.com/platform_api/StartScenarios?account_id=9968941&api_key=7d6066d1-ec84-4a23-bebe-37deba8c26c9" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "rule_id=1374441" \
  -d "script_custom_data={\"phone_number\":\"$PHONE_NUMBER\"}" \
  | python3 -m json.tool

echo ""
echo "If you see 'result: 1' and a call_session_history_id, the call was initiated successfully!"

