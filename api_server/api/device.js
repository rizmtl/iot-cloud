'use strict';
/**
 * Device Api end points. 
 * Allows create, read, updat & delete devices
 */
class DeviceApi {
  constructor(options) {
    if (!options) {
      return;
    }
    this.deviceManager = options.deviceManager;
    this.createRoutes(options.app, options.deviceManager);
  }

  createRoutes(app, deviceManager) {
    app.post('/api/_/device', async (req, res, next) => {
      let device;
      try {
        device = await deviceManager.createDevice(req.body);
      } catch(error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(201);
      res.send(device);
      next();
    });

    app.get('/api/_/device/:id', async (req, res, next) => {
      let device;
      
      try {
        device = await deviceManager.getDevice({ id: req.params.id });
      } catch(error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(200);
      res.send(device);
      next();
    });

    app.get('/api/_/device', async (req, res, next) => {
      let devices;
      
      try {
        devices = await deviceManager.getAllDevices();
      } catch(error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(200);
      res.send(devices);
      next();
    });

    app.put('/api/_/device/:id', async (req, res, next) => {
      let device;
      try {
        device = await deviceManager.updateDevice({ id: req.params.id }, req.body);
      } catch (error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(200);
      res.send(device);
      next();
    });

    app.delete('/api/_/device/:id', async (req, res, next) => {
      let status;
      try {
        status = await deviceManager.deleteDevice({ id: req.params.id });
      } catch (error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(200);
      res.send(status);
      next();
    });

    app.delete('/api/_/device', async (req, res, next) => {
      let status;
      try {
        status = await deviceManager.deleteAllDevices();
      } catch (error) {
        res.status(error.statusCode);
        res.send(error);
        next();
        return;
      }

      res.status(200);
      res.send(status);
      next();
    });
  }
}

module.exports = DeviceApi;
