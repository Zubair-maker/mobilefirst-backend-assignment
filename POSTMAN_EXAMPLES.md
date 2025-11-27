# Postman Request Body Examples for Properties API

Copy and paste these JSON examples directly into Postman's request body.

## Base URLs
```
POST http://localhost:3000/properties          # Filter and paginate properties
GET  http://localhost:3000/properties/:id      # Get single property by ID
```

## Headers
```
Content-Type: application/json
```

---

## GET Property by ID

### Example: Get Property with ID 1
**Method:** `GET`  
**URL:** `http://localhost:3000/properties/1`

No request body needed. Just replace `1` with the actual property ID you want to fetch.

**Example URLs:**
- `GET http://localhost:3000/properties/1`
- `GET http://localhost:3000/properties/5`
- `GET http://localhost:3000/properties/10`

**Response (200 OK):**
Returns the complete property object with all details.

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Property with ID 999 not found",
  "error": "Not Found"
}
```

---

## POST Properties with Filters

---

## Example 1: Get All Properties (No Filters)
```json
{
  "page": 1,
  "limit": 10
}
```

**Or simply:**
```json
{}
```

---

## Example 2: Filter by Purpose - Buy Only
```json
{
  "purpose": "Buy",
  "page": 1,
  "limit": 10
}
```

---

## Example 3: Filter by Purpose - Rent Only
```json
{
  "purpose": "Rent",
  "page": 1,
  "limit": 10
}
```

---

## Example 4: Filter by Completion Status - Ready Properties
```json
{
  "completion": "Ready",
  "page": 1,
  "limit": 10
}
```

---

## Example 5: Filter by Completion Status - Off-Plan Properties
```json
{
  "completion": "Off-Plan",
  "page": 1,
  "limit": 10
}
```

---

## Example 6: Filter by Completion Status - All (No Filter)
```json
{
  "completion": "All",
  "page": 1,
  "limit": 10
}
```

---

## Example 7: Filter by Property Type - Apartment
```json
{
  "type": "Apartment",
  "page": 1,
  "limit": 10
}
```

---

## Example 8: Filter by Property Type - Villa
```json
{
  "type": "Villa",
  "page": 1,
  "limit": 10
}
```

---

## Example 9: Filter by Property Type - Townhouse
```json
{
  "type": "Townhouse",
  "page": 1,
  "limit": 10
}
```

---

## Example 10: Filter by Bedrooms - 2 Bedrooms
```json
{
  "bedrooms": 2,
  "page": 1,
  "limit": 10
}
```

---

## Example 11: Filter by Bathrooms - 2 Bathrooms
```json
{
  "bathrooms": 2,
  "page": 1,
  "limit": 10
}
```

---

## Example 12: Filter by Bedrooms and Bathrooms
```json
{
  "bedrooms": 2,
  "bathrooms": 2,
  "page": 1,
  "limit": 10
}
```

---

## Example 13: Filter by Price - Minimum Price Only
```json
{
  "minPrice": 1000000,
  "page": 1,
  "limit": 10
}
```

---

## Example 14: Filter by Price - Maximum Price Only
```json
{
  "maxPrice": 5000000,
  "page": 1,
  "limit": 10
}
```

---

## Example 15: Filter by Price Range
```json
{
  "minPrice": 1000000,
  "maxPrice": 5000000,
  "page": 1,
  "limit": 10
}
```

---

## Example 16: Filter by Location
```json
{
  "location": "Dubai",
  "page": 1,
  "limit": 10
}
```

---

## Example 17: Filter by Location - Specific Area
```json
{
  "location": "Downtown Dubai",
  "page": 1,
  "limit": 10
}
```

---

## Example 18: Combined Filters - Buy + Ready + Apartment
```json
{
  "purpose": "Buy",
  "completion": "Ready",
  "type": "Apartment",
  "page": 1,
  "limit": 10
}
```

---

## Example 19: Combined Filters - Rent + Off-Plan + Villa
```json
{
  "purpose": "Rent",
  "completion": "Off-Plan",
  "type": "Villa",
  "page": 1,
  "limit": 10
}
```

---

## Example 20: Combined Filters - Buy + Ready + 2 Bedrooms + 2 Bathrooms
```json
{
  "purpose": "Buy",
  "completion": "Ready",
  "bedrooms": 2,
  "bathrooms": 2,
  "page": 1,
  "limit": 10
}
```

---

## Example 21: Combined Filters - Price Range + Location
```json
{
  "minPrice": 2000000,
  "maxPrice": 8000000,
  "location": "Dubai",
  "page": 1,
  "limit": 10
}
```

---

## Example 22: Complete Filter - All Filters Combined
```json
{
  "purpose": "Buy",
  "completion": "Ready",
  "type": "Apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "minPrice": 1000000,
  "maxPrice": 5000000,
  "location": "Dubai",
  "page": 1,
  "limit": 10
}
```

---

## Example 23: Pagination - Page 1
```json
{
  "page": 1,
  "limit": 5
}
```

---

## Example 24: Pagination - Page 2
```json
{
  "page": 2,
  "limit": 5
}
```

---

## Example 25: Pagination - Large Page Size
```json
{
  "page": 1,
  "limit": 50
}
```

---

## Example 26: Filter by Multiple Property Types (Studio)
```json
{
  "type": "Studio",
  "page": 1,
  "limit": 10
}
```

---

## Example 27: Filter by Multiple Property Types (Penthouse)
```json
{
  "type": "Penthouse",
  "page": 1,
  "limit": 10
}
```

---

## Example 28: Filter - 3 Bedrooms + Price Range
```json
{
  "bedrooms": 3,
  "minPrice": 2000000,
  "maxPrice": 6000000,
  "page": 1,
  "limit": 10
}
```

---

## Example 29: Filter - Rent + Ready + Location + Price
```json
{
  "purpose": "Rent",
  "completion": "Ready",
  "location": "Dubai Marina",
  "minPrice": 50000,
  "maxPrice": 200000,
  "page": 1,
  "limit": 10
}
```

---

## Example 30: Filter - Buy + Off-Plan + Villa + 4 Bedrooms
```json
{
  "purpose": "Buy",
  "completion": "Off-Plan",
  "type": "Villa",
  "bedrooms": 4,
  "page": 1,
  "limit": 10
}
```

---

## Quick Reference: Valid Values

### Purpose
- `"Buy"` → Filters properties with `purpose = "For Sale"`
- `"Rent"` → Filters properties with `purpose = "For Rent"`

### Completion
- `"All"` → No filter (returns all)
- `"Ready"` → Filters properties with `completion = "Ready"`
- `"Off-Plan"` → Filters properties with `completion = "Off-Plan"`

### Type
- `"Apartment"`
- `"Villa"`
- `"Townhouse"`
- `"Penthouse"`
- `"Studio"`

### Bedrooms & Bathrooms
- Integer values: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8+`

### Price
- Numbers (in AED): `1000000`, `5000000`, etc.
- Use `minPrice` for minimum price
- Use `maxPrice` for maximum price
- Use both for a price range

### Location
- String: `"Dubai"`, `"Dubai Marina"`, `"Downtown Dubai"`, etc.
- Partial match (case-insensitive)

### Pagination
- `page`: Integer starting from 1 (default: 1)
- `limit`: Integer, items per page (default: 10)

