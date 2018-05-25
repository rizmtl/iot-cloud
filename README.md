# IoT Cloud

This project simulates a cloud environment for iot devices, where devices with various sensor can connect to the cloud and store various their information. 

## Project Architecture
This project has 4 main components each running in its own docker container. Details on the components are provided in sections below

### Api server
Api servers provides end point api to create, update, read & delete devices in database. Functionality and end points are listed below

* POST: `/api/_/device` Creates device
* GET: `/api/_/device/:id` Returns information of device for given id
* GET: `/api/_/device` Returns information of all devices
* PUT: `/api/_/device/:id` Update information of device
* DELETE: `/api/_/device/:id` Delete device for given ide
* DELETE: `/api/_/device` Delete all devices in database

### Database
This project uses mongodb as its database. Data is stored in `devices` collection inside `sensors` database. Default port `27017` is used to connect to mongo.

Sample data schema is shown below
```
{
	"_id" : ObjectId("5b07668cdd8de2de9e388f82"),
	"name" : "Device-3",
	"sensors" : [
		{
			"value" : 81,
			"name" : "Sensor-0",
			"unit" : "Ampere"
		},
		{
			"value" : 85,
			"name" : "Sensor-1",
			"unit" : "Ampere"
		},
		{
			"value" : 23,
			"name" : "Sensor-2",
			"unit" : "Ampere"
		}
	],
	"id" : "d07e8b30-5fba-11e8-938a-2d92311bcc09"
}
```

### Dashboard
Dashboard displays list of devices and its current sensor information stored in the database. After container `dashboard` starts, it can be accessed at `http://localhost:8080`

### Simulator
Simulator is designed to simulate devices along with other functionalities. To test the system, it is recommend to use the `--auto` option. This will generate 5 devices with a maximum of 5 sensors each. 

Once `api_server` container is online, simulator can be executed on the container itself `docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js [OPTS] [ARGS]`

Help menu for the container is shown below
```
docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --help
node index.js [opts] [args]
    --create  : Creates a device, will require '--name' & '--sensor' parameters
    --name    : Device name
    --sensor  : Sensor parameters, takes multiple values, e.g: name1:value1:unit1 name2:value2:unit2
    --update  : Updates device paramter, will require '--id' & '--sensor' parameter
    --id      : Device id. A new id will be assigned if not provided
    --delete  : Delete device, will require '--id' parameter
    --get     : Returns all devices if '--id' parameter is not provided
    --start   : Starts simulation with existing devices in dB
    --auto    : Auto generates 5 devices with random number of sensors upto 5 sensors each (Recommended to use for quick check)
    --clean   : Cleans database
    --help    : Prints help
```
Usage example: 

* To create a device: 
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --create --name Device-1 --sensor s1:20:celcius s2:50:Volts`

* To delete a device:
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --delete --id <Device ID>`

* To get a device:
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --get --id <Device ID>`

* To get all devices:
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --get --id <Device ID>`

* To update a device:
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --update --id 8c3f4be0-5fc3-11e8-938a-2d92311bcc09  --sensor s1:13:celcius s2:25:Volts`

* To start simulation of exting devices in database
`docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --start`

* To clean dB to add fresh new devices `docker exec -it --user root api_server /usr/local/bin/node/opt/iot/api_server/simulator/index.js --clean`

# Project Setup
Below are steps to start the project. 
* Clone this repo
* Navigate to root folder and create docker containers `docker-compose build`
* Run the containers after they are created `docker-compose up`.
* Start device simulation. It is recommend to use `--auto` option, as this will auto generate devices and start simulation. Device paramters are updated every 3 seconds. Note that any devices that are stored in dB will be also added to simulation.
  ```
  docker exec -it --user root api_server /usr/local/bin/node /opt/iot/api_server/simulator/index.js --auto
  ```
* Open browser and navigate to `localhost:8080`

  

