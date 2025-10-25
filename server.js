
const express = require('express');
const app = express();
app.use(express.json());
// Intelligent rule-based analysis (no AI API needed)
function analyzeEnvironment(temperature, humidity, dustDensity, gasValue) {
  const analysis = {
    weatherPrediction: predictWeather(temperature, humidity),
    clothingRecommendation: getClothingAdvice(temperature, humidity),
    airQualityAdvice: getAirQualityAdvice(dustDensity, gasValue),
    maskNeeded: shouldWearMask(dustDensity, gasValue),
    stayHome: shouldStayHome(dustDensity, gasValue, temperature),
    overallAdvice: "",
    detailedComments: {
      temperatureAnalysis: analyzeTemperature(temperature),
      humidityAnalysis: analyzeHumidity(humidity, temperature),
      dustAnalysis: analyzeDust(dustDensity),
      gasAnalysis: analyzeGas(gasValue),
      safetyReasoning: ""
    }
  };

  // Generate overall advice
  analysis.overallAdvice = generateOverallAdvice(analysis, temperature, humidity, dustDensity, gasValue);
  analysis.detailedComments.safetyReasoning = generateSafetyReasoning(analysis);

  return analysis;
}

function predictWeather(temp, humidity) {
  let prediction = "";

  // Temperature prediction
  if (temp < 0) {
    prediction = "Freezing conditions expected. ";
  } else if (temp < 10) {
    prediction = "Cold weather expected. ";
  } else if (temp < 20) {
    prediction = "Cool weather expected. ";
  } else if (temp < 30) {
    prediction = "Pleasant weather expected. ";
  } else if (temp < 35) {
    prediction = "Warm weather expected. ";
  } else {
    prediction = "Very hot weather expected. ";
  }

  // Humidity and rain prediction
  if (humidity > 80 && temp > 15) {
    prediction += "High humidity with possible rain showers in the next hour. ";
  } else if (humidity > 70) {
    prediction += "Moderate to high humidity, clouds likely. ";
  } else if (humidity < 30) {
    prediction += "Very dry air, clear skies expected. ";
  } else {
    prediction += "Comfortable humidity levels. ";
  }

  // Temperature trend
  if (temp > 30 && humidity > 60) {
    prediction += "Expect muggy, uncomfortable conditions.";
  } else if (temp < 5 && humidity > 70) {
    prediction += "Damp, cold conditions - feels colder than actual temperature.";
  }

  return prediction;
}

function getClothingAdvice(temp, humidity) {
  let advice = [];

  // Base clothing
  if (temp < 5) {
    advice.push("Wear heavy winter clothes: thick coat, scarf, gloves, warm boots");
  } else if (temp < 15) {
    advice.push("Wear warm clothes: jacket or sweater, long pants");
  } else if (temp < 25) {
    advice.push("Wear light layers: t-shirt with a light jacket or cardigan");
  } else if (temp < 32) {
    advice.push("Wear light, breathable clothes: t-shirt, shorts or light pants");
  } else {
    advice.push("Wear very light, loose-fitting clothes in light colors to reflect heat");
  }

  // Umbrella/rain gear
  if (humidity > 80 && temp > 10) {
    advice.push("Take an umbrella - high chance of rain");
    advice.push("Consider waterproof shoes");
  } else if (humidity > 75 && temp > 15) {
    advice.push("Consider bringing an umbrella - rain is possible");
  }

  // Special conditions
  if (temp > 35) {
    advice.push("Wear a hat and sunglasses for sun protection");
    advice.push("Light colors recommended to stay cooler");
  }

  if (humidity < 30) {
    advice.push("Apply moisturizer - dry air can irritate skin");
  }

  return advice.join(". ") + ".";
}

function getAirQualityAdvice(dust, gas) {
  let advice = [];

  // Dust advice (PM2.5 standards)
  if (dust <= 12) {
    advice.push("Air quality is good");
  } else if (dust <= 35) {
    advice.push("Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion");
  } else if (dust <= 55) {
    advice.push("Air quality is unhealthy for sensitive groups (children, elderly, people with respiratory conditions)");
  } else if (dust <= 150) {
    advice.push("Air quality is unhealthy for everyone. Everyone should limit prolonged outdoor exertion");
  } else if (dust <= 250) {
    advice.push("Air quality is very unhealthy. Everyone should avoid prolonged outdoor exertion");
  } else {
    advice.push("AIR QUALITY IS HAZARDOUS! Avoid all outdoor activities");
  }

  // Gas advice
  if (gas > 1000) {
    advice.push("DANGEROUS gas levels detected! Ventilate area immediately and evacuate if possible");
  } else if (gas > 500) {
    advice.push("High gas concentration detected. Limit exposure and ensure good ventilation");
  } else if (gas > 300) {
    advice.push("Elevated gas levels. Reduce outdoor exposure time");
  } else if (gas > 200) {
    advice.push("Slightly elevated gas levels. Monitor your environment");
  } else {
    advice.push("Gas levels are within normal range");
  }

  return advice.join(". ") + ".";
}

function shouldWearMask(dust, gas) {
  return dust > 55 || gas > 500;
}

function shouldStayHome(dust, gas, temp) {
  // Critical air quality
  if (dust > 250 || gas > 1000) return true;
  
  // Extreme temperature combined with bad air
  if ((temp > 40 || temp < -10) && (dust > 150 || gas > 500)) return true;
  
  return false;
}

function analyzeTemperature(temp) {
  if (temp < 0) {
    return `${temp}°C is below freezing. Risk of frostbite and hypothermia. Water freezes at this temperature. Exposed skin can be damaged in minutes.`;
  } else if (temp < 10) {
    return `${temp}°C is cold. Your body will need to work harder to maintain core temperature. Multiple layers are essential.`;
  } else if (temp < 20) {
    return `${temp}°C is cool and comfortable for most activities. Light jacket recommended as you may feel chilly in shade or wind.`;
  } else if (temp < 26) {
    return `${temp}°C is ideal room temperature. Most comfortable range for human activity. No special precautions needed.`;
  } else if (temp < 32) {
    return `${temp}°C is warm. You'll likely feel comfortable but may start sweating during physical activity. Stay hydrated.`;
  } else if (temp < 38) {
    return `${temp}°C is hot. Risk of heat exhaustion increases. Drink plenty of water and limit strenuous activity. Seek shade when possible.`;
  } else {
    return `${temp}°C is extremely hot and dangerous. High risk of heat stroke. Avoid outdoor activities. This temperature can be life-threatening without proper precautions.`;
  }
}

function analyzeHumidity(humidity, temp) {
  let analysis = `${humidity}% humidity `;

  if (humidity < 25) {
    analysis += "is very dry. You may experience dry skin, irritated eyes, and respiratory discomfort. Static electricity increases. ";
  } else if (humidity < 40) {
    analysis += "is on the dry side. Generally comfortable, but some people may notice dry skin or throat. ";
  } else if (humidity < 60) {
    analysis += "is in the comfortable range. This is ideal for most people. ";
  } else if (humidity < 75) {
    analysis += "is getting humid. You may start feeling sticky, especially with warmer temperatures. ";
  } else if (humidity < 85) {
    analysis += "is high. The air feels heavy and muggy. Sweat doesn't evaporate well, making it harder to cool down. ";
  } else {
    analysis += "is very high. The air is saturated with moisture. Rain is likely. Mold growth risk increases indoors. ";
  }

  // Heat index effect
  if (temp > 27 && humidity > 60) {
    const heatIndex = temp + (0.5 * (humidity - 60) * 0.1);
    analysis += `Combined with the temperature, it feels like ${Math.round(heatIndex)}°C (heat index). `;
  }

  return analysis;
}

function analyzeDust(dust) {
  let analysis = `Dust density of ${dust} µg/m³ `;

  if (dust <= 12) {
    analysis += "is excellent. This meets WHO guidelines for healthy air. No health concerns for anyone. ";
  } else if (dust <= 35) {
    analysis += "is good. This is acceptable for general public, though sensitive individuals may want to monitor their symptoms. ";
  } else if (dust <= 55) {
    analysis += "is moderate and unhealthy for sensitive groups. Children, elderly, and those with asthma or heart disease should limit prolonged outdoor activity. ";
  } else if (dust <= 150) {
    analysis += "is unhealthy. Everyone may begin to experience health effects. Active children, adults, and people with respiratory disease should limit prolonged outdoor exertion. ";
  } else if (dust <= 250) {
    analysis += "is very unhealthy. Health alert level. Everyone may experience more serious health effects. Avoid prolonged outdoor activities. N95 masks are recommended. ";
  } else {
    analysis += "is HAZARDOUS. Health warning of emergency conditions. The entire population is likely to be affected. Stay indoors with windows closed. Use air purifiers if available. ";
  }

  // Source explanation
  if (dust > 150) {
    analysis += "This level typically indicates wildfires, dust storms, or severe pollution events nearby.";
  }

  return analysis;
}

function analyzeGas(gas) {
  let analysis = `Gas sensor reading of ${gas} ppm `;

  if (gas < 100) {
    analysis += "is normal. This represents typical background air quality with no concerning volatile organic compounds (VOCs) or harmful gases. ";
  } else if (gas < 200) {
    analysis += "is slightly elevated but generally safe. This might indicate normal indoor activities like cooking or cleaning. Ensure adequate ventilation. ";
  } else if (gas < 400) {
    analysis += "is elevated. This suggests moderate VOC presence from sources like paints, cleaning products, or vehicle exhaust. Sensitive individuals may notice odors or mild irritation. ";
  } else if (gas < 600) {
    analysis += "is high. Significant VOC concentration detected. May cause headaches, eye irritation, or respiratory discomfort. Identify and remove pollution source. Increase ventilation. ";
  } else if (gas < 1000) {
    analysis += "is very high and concerning. This indicates poor air quality from strong chemical sources or combustion. May cause dizziness, nausea, or difficulty breathing. Leave the area if symptoms occur. ";
  } else {
    analysis += "is DANGEROUS. This level indicates potentially toxic gas concentrations. Immediate health risks including severe respiratory distress, nervous system effects, or carbon monoxide poisoning. Evacuate area and seek fresh air immediately. ";
  }

  return analysis;
}

function generateOverallAdvice(analysis, temp, humidity, dust, gas) {
  if (analysis.stayHome) {
    return "⚠️ STAY HOME: Environmental conditions are dangerous. Air quality is hazardous and poses serious health risks. Only go outside if absolutely necessary, and use N95 mask and protective equipment.";
  }

  let advice = [];

  if (analysis.maskNeeded) {
    advice.push("You can go outside, but MUST wear an N95 or KN95 mask due to poor air quality");
  } else {
    advice.push("It's safe to go outside");
  }

  if (temp > 35) {
    advice.push("Stay hydrated and take frequent breaks in shade");
  } else if (temp < 5) {
    advice.push("Protect all exposed skin from cold");
  }

  if (humidity > 80 && temp > 20) {
    advice.push("Expect uncomfortable humid conditions");
  }

  if (dust > 55 || gas > 300) {
    advice.push("Limit time outdoors to essential activities only");
  }

  return advice.join(". ") + ".";
}

function generateSafetyReasoning(analysis) {
  let reasons = [];

  if (analysis.stayHome) {
    reasons.push("The stay-home recommendation is based on hazardous environmental conditions that pose immediate health risks");
  }

  if (analysis.maskNeeded) {
    reasons.push("Mask is required because air quality exceeds safe thresholds for particulate matter or harmful gases");
  } else {
    reasons.push("No mask needed as air quality is within acceptable limits");
  }

  reasons.push("Clothing recommendations are based on temperature, humidity, and precipitation probability");
  reasons.push("These recommendations follow EPA air quality standards and WHO health guidelines");

  return reasons.join(". ") + ".";
}

function addRuleBasedInsights(sensorData) {
  const insights = {
    weatherWarnings: [],
    airQualityWarnings: [],
    urgencyLevel: "normal"
  };

  // Temperature warnings
  if (sensorData.temperature > 38) {
    insights.weatherWarnings.push("🔥 EXTREME HEAT WARNING");
    insights.urgencyLevel = "critical";
  } else if (sensorData.temperature > 35) {
    insights.weatherWarnings.push("⚠️ Heat warning");
    insights.urgencyLevel = "high";
  } else if (sensorData.temperature < -5) {
    insights.weatherWarnings.push("🥶 EXTREME COLD WARNING");
    insights.urgencyLevel = "critical";
  } else if (sensorData.temperature < 5) {
    insights.weatherWarnings.push("❄️ Cold warning");
    insights.urgencyLevel = "high";
  }

  // Humidity warnings
  if (sensorData.humidity > 85 && sensorData.temperature > 25) {
    insights.weatherWarnings.push("💧 Very high humidity - expect heavy rain");
  } else if (sensorData.humidity < 25) {
    insights.weatherWarnings.push("🌵 Very dry air warning");
  }

  // Dust warnings
  if (sensorData.dustDensity > 250) {
    insights.airQualityWarnings.push("🚨 HAZARDOUS dust levels!");
    insights.urgencyLevel = "critical";
  } else if (sensorData.dustDensity > 150) {
    insights.airQualityWarnings.push("⚠️ Very unhealthy dust levels");
    if (insights.urgencyLevel === "normal") insights.urgencyLevel = "high";
  } else if (sensorData.dustDensity > 55) {
    insights.airQualityWarnings.push("😷 Unhealthy dust for sensitive groups");
  }

  // Gas warnings
  if (sensorData.gasValue > 1000) {
    insights.airQualityWarnings.push("🚨 DANGEROUS gas levels!");
    insights.urgencyLevel = "critical";
  } else if (sensorData.gasValue > 500) {
    insights.airQualityWarnings.push("⚠️ High gas concentration");
    if (insights.urgencyLevel === "normal") insights.urgencyLevel = "high";
  } else if (sensorData.gasValue > 300) {
    insights.airQualityWarnings.push("⚡ Elevated gas levels");
  }

  return insights;
}

function generateQuickSummary(analysis, insights) {
  const summary = {
    urgency: insights.urgencyLevel,
    canGoOutSafely: !analysis.stayHome,
    essentials: []
  };

  if (analysis.maskNeeded) summary.essentials.push("😷 Mask (N95/KN95)");
  
  if (analysis.clothingRecommendation.toLowerCase().includes("umbrella")) {
    summary.essentials.push("☂️ Umbrella");
  }
  
  if (analysis.clothingRecommendation.toLowerCase().includes("jacket") || 
      analysis.clothingRecommendation.toLowerCase().includes("coat")) {
    summary.essentials.push("🧥 Jacket/Coat");
  }

  if (analysis.clothingRecommendation.toLowerCase().includes("hat") || 
      analysis.clothingRecommendation.toLowerCase().includes("sunglasses")) {
    summary.essentials.push("🕶️ Sun protection");
  }

  const allWarnings = [
    ...insights.weatherWarnings,
    ...insights.airQualityWarnings
  ];

  if (allWarnings.length > 0) {
    summary.warnings = allWarnings;
  } else {
    summary.message = "✅ Good conditions - enjoy your day!";
  }

  return summary;
}

// Main API endpoint
app.post('/api/analyze', (req, res) => {
  try {
    console.log("done");
    const { temperature, humidity, dustDensity, gasValue } = req.body;

    if (temperature === undefined || humidity === undefined || 
        dustDensity === undefined || gasValue === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: temperature, humidity, dustDensity, gasValue',
        example: {
          temperature: 25,
          humidity: 70,
          dustDensity: 50,
          gasValue: 200
        }
      });
    }

    const sensorData = { temperature, humidity, dustDensity, gasValue };

    // Analyze with intelligent rules (no AI API needed!)
    const analysis = analyzeEnvironment(temperature, humidity, dustDensity, gasValue);
    const insights = addRuleBasedInsights(sensorData);

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      sensorData: {
        temperature: `${sensorData.temperature}°C`,
        humidity: `${sensorData.humidity}%`,
        dustDensity: `${sensorData.dustDensity} µg/m³`,
        gasValue: `${sensorData.gasValue} ppm`
      },
      recommendations: {
        weatherPrediction: analysis.weatherPrediction,
        clothingRecommendation: analysis.clothingRecommendation,
        airQualityAdvice: analysis.airQualityAdvice,
        maskNeeded: analysis.maskNeeded,
        stayHome: analysis.stayHome,
        overallAdvice: analysis.overallAdvice
      },
      detailedComments: analysis.detailedComments,
      ruleBasedInsights: insights,
      quickSummary: generateQuickSummary(analysis, insights)
    };

    res.json(response);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze data', 
      details: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: 'Free Rule-Based System'
  });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`🚀 FREE API running on port ${PORT}`);
  console.log(`📊 No AI API needed - 100% rule-based!`);
  console.log(`\nEndpoint: POST http://localhost:${PORT}/api/analyze`);
  console.log(`\nExample request:`);
  console.log(JSON.stringify({
    temperature: 25,
    humidity: 70,
    dustDensity: 150,
    gasValue: 300
  }, null, 2));
});