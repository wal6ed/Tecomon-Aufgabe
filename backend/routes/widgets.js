const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');

router.get('/', widgetController.getWidgets);
router.get('/:id', widgetController.getWidgetById);
router.post('/', widgetController.createWidget);
router.delete('/:id', widgetController.deleteWidget);

router.get('/:location/weather', widgetController.getWeatherLoction);

module.exports = router;
