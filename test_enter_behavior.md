# Enter Key Behavior Test

## Expected Behavior:
1. **Single Enter with input** → Validate (green if correct, red if wrong)
2. **Double Enter (any time)** → Skip equation (orange flash)
3. **Single Enter with no input** → Nothing happens (just sets timestamp for potential double-tap)

## Current Implementation:
- Single Enter with input: Validates immediately
- Double Enter (within 400ms): Skips equation
- Processing lock prevents spam
- All borders clear properly after timeouts

## Test Cases:
1. Type "x+1" and press Enter once → Should show green/red border
2. Press Enter twice quickly (no input) → Should skip with orange
3. Type "x+1", press Enter twice quickly → Should skip (not validate)
4. Press Enter once (no input), wait, press Enter again → Should do nothing

## Potential Issues:
- Timing conflicts between validation and skip
- State cleanup issues
- Border animation conflicts
