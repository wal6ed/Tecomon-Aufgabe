const Widget = require('../models/Widget');
const { getWeather } = require('../services/weatherService');

// Get all widgets
exports.getWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find().sort({ createdAt: -1 });
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: 'Server error while retrieving' });
  }
};

// Get widget By Id
exports.getWidgetById = async (req, res) => {
  const { id } = req.params;

  try {
    const widget = await Widget.findById(id);

    if (!widget) {
      return res.status(404).json({ message: 'Widget not found' });
    }

    res.json(widget);
  } catch (err) {
    res.status(500).json({ message: 'Server error while retrieving the widgets' });
  }
};

// Create new widget
exports.createWidget = async (req, res) => {
  const { location } = req.body;
  if (!location) return res.status(400).json({ error: 'Location missing' });

  try {
    const widget = new Widget({ location });
    const weather = await getWeather(location)

    if (await Widget.findOne({"location": location})) {
        return res.status(404).json({ message: 'Widget is already Added' });
    } else {
        await widget.save(); 
    }
    res.status(201).json(widget);
  } catch (err) {
    if (err.message === "Location not found") {
        res.status(500).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error creating' });
  }
};

// Delete widget
exports.deleteWidget = async (req, res) => {
  const { id } = req.params;
  try {
    await Widget.findByIdAndDelete(id);
    res.json({ message: 'Widget deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting' });
  }
};

// Retrieve weather data for a location
exports.getWeatherLoction = async (req, res) => {
  try {
    const weather = await getWeather(req.params.location);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: 'Weather data could not be loaded' });
  }
};
