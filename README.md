# Weather Trading AI Bot

## Overview

The Weather Trading AI Bot is a full-stack application that provides intelligent trading recommendations based on weather patterns across the United States. The system analyzes temperature data to generate Heating Degree Day (HDD) and Cooling Degree Day (CDD) stock recommendations for different regions and seasons.

## Architecture

### Frontend
- **Technology**: ReactJS
- **Purpose**: User interface for interacting with the trading recommendation system
- **Features**: 
  - User context input (job/industry information)
  - State selection (50 US states)
  - Trading recommendation display

### Backend
- **Technology**: AWS Lambda + AWS Bedrock
- **API Endpoint**: `https://x2rdbaxphlsfdxftl5u5pzspa40domrl.lambda-url.us-west-2.on.aws/`
- **Runtime**: Node.js

## API Documentation

### Endpoint
`https://x2rdbaxphlsfdxftl5u5pzspa40domrl.lambda-url.us-west-2.on.aws/`

### Headers
```json
{
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "Content-Type",
"Access-Control-Allow-Methods": "POST,OPTIONS"
}
```

### Request Requirements
- **Method**: POST
- **User Context**: String describing user's job or industry of interest
- **Location Data**: State abbreviation

### Response Format
```json
{
"start_month": "December",
"end_month": "February",
"stock": "HDD",
"reasoning": "Detailed explanation of the recommendation based on weather patterns"
}
```

## Data Sources & Processing

### Weather Data
- **Source**: NCEI (National Centers for Environmental Information)
- **Coverage**: 50 US states
- **Location Strategy**: Uses weather station from each state's capital city
- **Time Period**: 12 months of data for 2024
- **Metrics**: 
  - TMAX (Maximum Temperature)
  - TMIN (Minimum Temperature)

### Trading Logic
- **HDD (Heating Degree Days)**: Recommended when temperatures are consistently below comfort levels (typically winter months)
- **CDD (Cooling Degree Days)**: Recommended when temperatures are consistently above comfort levels (typically summer months)

## Design Decisions

### Location Selection
- Uses state capitals as representative weather stations
- Implements fallback to first available NCEI station for each state
- Provides consistent geographic coverage across all 50 states

### CORS Configuration
- Allows cross-origin requests from any domain (`*`)
- Supports POST and OPTIONS methods
- Accepts Content-Type headers

### Data Analysis
- Processes 12 months of temperature data
- Calculates degree days based on temperature thresholds
- Generates seasonal recommendations with detailed reasoning
